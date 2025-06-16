# 🚀 Speedcast API Framework

A high-performance, TypeScript-first HTTP client for modern web applications. Built for speed, reliability, and developer experience.

## ✨ Features

- 🔒 **Type Safety** - Full TypeScript support with intelligent auto-completion
- ⚡ **Request Optimization** - Built-in caching, deduplication, and retry logic
- 🛡️ **Rate Limiting** - Prevent API abuse with configurable rate limits
- 🪶 **Lightweight** - Minimal bundle size with maximum functionality
- 🎯 **Promise-based** - Modern async/await API
- 🔄 **Auto Retry** - Intelligent retry logic with exponential backoff
- 💾 **Smart Caching** - Configurable request caching with TTL
- 🔀 **Request Deduplication** - Prevents duplicate simultaneous requests

## 📦 Installation

```bash
npm install speedcast
# or
yarn add speedcast
# or
pnpm add speedcast
```

## 🚀 Quick Start

```typescript
import { SpeedcastApi } from 'speedcast';

// Create an instance
const api = new SpeedcastApi({
  baseURL: 'https://api.example.com',
  timeout: 10000,
  retries: 3,
  cache: true,
  rateLimit: {
    requests: 100,
    window: 60000 // 1 minute
  }
});

// Make requests
const response = await api.get('/users');
console.log(response.data);
```

## 🛠️ Configuration

### Basic Configuration

```typescript
import { SpeedcastApi, SpeedcastConfig } from 'speedcast';

const config: SpeedcastConfig = {
  baseURL: 'https://api.example.com',
  defaultHeaders: {
    'Authorization': 'Bearer your-token',
    'X-API-Key': 'your-api-key'
  },
  timeout: 15000,
  retries: 3,
  cache: true,
  cacheTTL: 300000, // 5 minutes
  rateLimit: {
    requests: 100,
    window: 60000
  }
};

const api = new SpeedcastApi(config);
```

### Alternative Factory Function

```typescript
import { createHmmApi } from 'speedcast';

const api = createHmmApi({
  baseURL: 'https://api.example.com'
});
```

## 📖 API Reference

### HTTP Methods

#### GET Request
```typescript
const response = await api.get<User[]>('/users');
const users = response.data;
```

#### POST Request
```typescript
const newUser = { name: 'John', email: 'john@example.com' };
const response = await api.post<User>('/users', newUser);
```

#### PUT Request
```typescript
const updatedUser = { name: 'John Doe', em