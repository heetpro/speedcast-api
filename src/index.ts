
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

}
