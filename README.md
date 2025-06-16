# 🚀 Speedcast API Framework

A lightweight and fast API client for Next.js and Node.js with built-in caching, rate limiting, and retry logic.

## ✨ Features

- ✅ Type Safety with TypeScript
- ✅ Request Optimization (caching, deduplication, retry logic)
- ✅ Rate Limiting
- ✅ Simple and lightweight
- ✅ Promise-based API

## Installation

```bash
npm install speedcast-api
# or
yarn add speedcast-api
# or
pnpm add speedcast-api
```

## Usage

### Basic Usage

```typescript
import { SpeedcastApi } from 'speedcast-api';

// Create a new instance
const api = new SpeedcastApi({
  baseURL: 'https://api.example.com',
  timeout: 5000,
  retries: 2
});

// Make a GET request
const getUsers = async () => {
  try {
    const response = await api.get('/users');
    console.log(response.data);
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// Make a POST request
const createUser = async (userData) => {
  try {
    const response = await api.post('/users', userData);
    console.log('User created:', response.data);
  } catch (error) {
    console.error('Error creating user:', error);
  }
};
```

### With Caching

```typescript
const api = new SpeedcastApi({
  baseURL: 'https://api.example.com',
  cache: true,
  cacheTTL: 60000 // 1 minute
});

// This request will be cached
const response1 = await api.get('/users', { cache: true });

// This will use the cached response if within TTL
const response2 = await api.get('/users', { cache: true });
```

### With Rate Limiting

```typescript
const api = new SpeedcastApi({
  baseURL: 'https://api.example.com',
  rateLimit: {
    requests: 5,
    window: 1000 // 5 requests per second
  }
});

// Requests will be automatically rate limited
```

## API Reference

### Configuration Options

```typescript
interface SpeedcastConfig {
  baseURL?: string;
  defaultHeaders?: Record<string, string>;
  timeout?: number;
  retries?: number;
  cache?: boolean;
  cacheTTL?: number;
  rateLimit?: {
    requests: number;
    window: number;
  };
}
```

### Methods

- `get<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>>`
- `post<T>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>>`
- `put<T>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>>`
- `patch<T>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>>`
- `delete<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>>`

### Response Format

```typescript
interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}
```

## License

ISC