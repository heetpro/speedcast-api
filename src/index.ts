
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

