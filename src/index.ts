
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
