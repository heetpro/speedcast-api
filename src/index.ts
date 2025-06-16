
/**
 * Speedcast Api Framework
 * A high-performance, type-safe API client with advanced caching, request optimization, and monitoring
 * 
 * @version 2.0.0
 * @author Heet vavadiya
 * @license MIT
 */

import { EventEmitter } from 'events';

export interface ApiConfig {
    baseURL: string;
    timeout?: number;
    retries?: number;
    headers?: Record<string, string>;
    auth?: AuthConfig;
    cache?: CacheConfig;
    rateLimit?: RateLimitConfig;
    monitoring?: MonitoringConfig;
}

export interface AuthConfig {
    type: 'bearer' | 'basic' | 'apikey';
    token?: string;
    username?: string;
    password?: string;
    apiKey?: string;
    apiKeyHeader?: string;
}  