
/**
 * Speedcast Api Framework
 * 
 *  * Features:
 * - Type Safety with TypeScript
 * - Request Optimization (caching, deduplication, retry logic)
 * - Rate Limiting
 * - Simple and lightweight
 * - Promise-based API
 * @version 1.0.0
 * @author Heet vavadiya
 * @license MIT
 */

export interface RequestConfig {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    headers?: Record<string, string>;
    body?: any;
    timeout?: number;
    retries?: number;
    cache?: boolean;
    cacheTTL?: number;
}


export interface ApiResponse<T = any> {
    data: T;
    status: number;
    statusText: string;
    headers: Record<string, string>;
}

export interface RateLimitConfig {
    requests: number;
    window: number;
}

export interface SpeedcastConfig {
    baseURL?: string;
    defaultHeaders?: Record<string, string>;
    timeout?: number;
    retries?: number;
    cache?: boolean;
    cacheTTL?: number;
    rateLimit?: RateLimitConfig;
}

class RateLimiter {
    private requests: number[] = [];
    private maxRequests: number;
    private windowMs: number;

    constructor(config: RateLimitConfig) {
        this.maxRequests = config.requests;
        this.windowMs = config.window;
    }

    async checkLimit(): Promise<void> {

        const now = Date.now();

        this.requests = this.requests.filter(time => now - time < this.windowMs);

        if (this.requests.length >= this.maxRequests) {
            const oldestRequest = this.requests[0];
            const waitTime = this.windowMs - (now - oldestRequest);

            if (waitTime > 0) {
                await new Promise(resolve => setTimeout(resolve, waitTime));
                return this.checkLimit();
            }
        }

        this.requests.push(now)
    }
}

class RequestCache {
    private cache = new Map<String, { data: any; expires: number }>();
    private defaultTTL: number;

    /*
        it defaulty seted to 5 minutes
    */
    constructor(defaultTTL: number = 300000) {
        this.defaultTTL = defaultTTL
    }

    set(key: string, data: any, ttl?: number): void {
        const expires = Date.now() + (ttl || this.defaultTTL);
        this.cache.set(key, { data, expires });
    }

    get(key: string): any | null {
        const cached = this.cache.get(key);

        if (!cached) return null;

        if (Date.now() > cached.expires) {
            this.cache.delete(key);
            return null;
        }
        return cached.data;
    }

    clear(): void {
        this.cache.clear;
    }

    private generateKey(url: string, config: RequestConfig): string {
        return `${config.method || 'GET'}:${url}:${JSON.stringify(config.body || {})}`;
    }

    getCacheKey(url: string, config: RequestConfig): string {
        return this.generateKey(url, config);
    }

}


class RequestDeduplicator {
    private pendingRequests = new Map<string, Promise<any>>();

    async deduplicate<T>(key: string, requestFn: () => Promise<T>): Promise<T> {
        if (this.pendingRequests.has(key)) {
            return this.pendingRequests.get(key) as Promise<T>;
        }

        const promise = requestFn().finally(() => {
            this.pendingRequests.delete(key);
        });

        this.pendingRequests.set(key, promise);
        return promise;
    }
}

export class SpeedcastApi {
    private baseURL: string;
    private defaultHeaders: Record<string, string>;
    private defaultTimeout: number;
    private defaultRetries: number;
    private cache: RequestCache;
    private rateLimiter: RateLimiter | null;
    private deduplicator: RequestDeduplicator;
    private defaultCacheEnabled: boolean;
    private defaultCacheTTL: number;

    constructor(config: SpeedcastConfig = {}) {
        this.baseURL = config.baseURL || '';
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            ...config.defaultHeaders
        };
        this.defaultTimeout = config.timeout || 10000;
        this.defaultRetries = config.retries || 3;
        this.defaultCacheEnabled = config.cache || false;
        this.defaultCacheTTL = config.cacheTTL || 300000;

        this.cache = new RequestCache(this.defaultCacheTTL);
        this.rateLimiter = config.rateLimit ? new RateLimiter(config.rateLimit) : null;
        this.deduplicator = new RequestDeduplicator();
    }

    async request<T = any>(url: string, config: RequestConfig = {}): Promise<ApiResponse<T>> {
        const fullUrl = this.buildUrl(url);
        const requestConfig = this.mergeConfig(config);


        if (this.rateLimiter) {
            await this.rateLimiter.checkLimit();
        }

        if ((requestConfig.method === 'GET' || !requestConfig.method) && requestConfig.cache) {
            const cacheKey = this.cache.getCacheKey(fullUrl, requestConfig);
            const cached = this.cache.get(cacheKey);
            if (cached) {
                return cached;
            }
        }

        const dedupeKey = `${requestConfig.method || 'GET'}:${fullUrl}:${JSON.stringify(requestConfig.body)}`;

        return this.deduplicator.deduplicate(dedupeKey, async () => {
            return this.executeRequest<T>(fullUrl, requestConfig);
        })
    }

    private async executeRequest<T>(url: string, config: RequestConfig): Promise<ApiResponse<T>> {
        let lastError: Error;

        for (let attempt = 0; attempt <= (config.retries || 0); attempt++) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), config.timeout);


                const response = await fetch(url, {
                    method: config.method || 'GET',
                    headers: config.headers,
                    body: config.body ? JSON.stringify(config.body) : undefined,
                    signal: controller.signal
                });


                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const data = await this.parseResponse<T>(response);

                const result: ApiResponse<T> = {
                    data,
                    status: response.status,
                    statusText: response.statusText,
                    headers: this.extractHeaders(response)
                };

                if ((config.method === 'GET' || !config.method) && config.cache) {
                    const cacheKey = this.cache.getCacheKey(url, config);
                    this.cache.set(cacheKey, result, config.cacheTTL);
                }

                return result;
            }
            catch (error) {
                lastError = error as Error;

                if (error instanceof Error && (
                    error.name === 'AbortError' ||
                    error.message.includes('400') ||
                    error.message.includes('401') ||
                    error.message.includes('403') ||
                    error.message.includes('404')
                )) {
                    break;
                }
                if (attempt < (config.retries || 0)) {
                    await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
                }
            }

        }
        throw lastError!;
    }

    // methods
    async get<T = any>(url: string, config: Omit<RequestConfig, 'method'> = {}): Promise<ApiResponse<T>> {
        return this.request<T>(url, { ...config, method: 'GET' });
    }

    async post<T = any>(url: string, data?: any, config: Omit<RequestConfig, 'method' | 'body'> = {}): Promise<ApiResponse<T>> {
        return this.request<T>(url, { ...config, method: 'POST', body: data });
    }

    async put<T = any>(url: string, data?: any, config: Omit<RequestConfig, 'method' | 'body'> = {}): Promise<ApiResponse<T>> {
        return this.request<T>(url, { ...config, method: 'PUT', body: data });
    }

    async delete<T = any>(url: string, config: Omit<RequestConfig, 'method'> = {}): Promise<ApiResponse<T>> {
        return this.request<T>(url, { ...config, method: 'DELETE' });
    }

    async patch<T = any>(url: string, data?: any, config: Omit<RequestConfig, 'method' | 'body'> = {}): Promise<ApiResponse<T>> {
        return this.request<T>(url, { ...config, method: 'PATCH', body: data });
    }


    private buildUrl(url: string): string {
        if (url.startsWith('https://') || url.startsWith('http://')) {
            return url;
        }

        const base = this.baseURL.endsWith('/') ? this.baseURL.slice(0, -1) : this.baseURL;
        const path = url.startsWith('/') ? url : `/${url}`;

        return `${base}${path}`
    }

    private mergeConfig(config: RequestConfig): RequestConfig {
        return {
            method: config.method || 'GET',
            headers: { ...this.defaultHeaders, ...config.headers },
            body: config.body,
            timeout: config.timeout || this.defaultTimeout,
            retries: config.retries !== undefined ? config.retries : this.defaultRetries,
            cache: config.cache !== undefined ? config.cache : this.defaultCacheEnabled,
            cacheTTL: config.cacheTTL || this.defaultCacheTTL
        };
    }

    private async parseResponse<T>(response: Response): Promise<T> {
        const contentType = response.headers.get('content-type');

        if (contentType?.includes('application/json')) {
            return response.json();
        }

        if (contentType?.includes('text/')) {
            return response.text() as unknown as T;
        }

        return response.blob() as unknown as T;
    }


    private extractHeaders(response: Response): Record<string, string> {
        const headers: Record<string, string> = {};
        response.headers.forEach((value, key) => {
            headers[key] = value;
        })
        return headers;
    }

    clearCache(): void {
        this.cache.clear();
    }

    setBaseURL(baseURL: string): void {
        this.baseURL = baseURL;
    }

    setDefaultHeaders(headers: Record<string, string>): void {
        this.defaultHeaders = { ...this.defaultHeaders, ...headers };
    }
}

