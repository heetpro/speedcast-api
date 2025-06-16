import { SpeedcastApi, createHmmApi } from '../src/index';
import { server } from './mocks/server';
import { http, HttpResponse } from 'msw';

describe('SpeedcastApi', () => {
  let api: SpeedcastApi;

  beforeEach(() => {
    api = new SpeedcastApi({
      baseURL: 'https://api.test.com',
      timeout: 5000,
      retries: 2,
      cache: true,
      cacheTTL: 1000
    });
  });

  afterEach(() => {
    api.clearCache();
  });

  describe('Constructor and Configuration', () => {
    it('should create instance with default config', () => {
      const defaultApi = new SpeedcastApi();
      expect(defaultApi).toBeInstanceOf(SpeedcastApi);
    });

    it('should create instance with custom config', () => {
      const customApi = new SpeedcastApi({
        baseURL: 'https://custom.api.com',
        timeout: 15000,
        retries: 5
      });
      expect(customApi).toBeInstanceOf(SpeedcastApi);
    });

    it('should create instance using factory function', () => {
      const factoryApi = createHmmApi({ baseURL: 'https://factory.api.com' });
      expect(factoryApi).toBeInstanceOf(SpeedcastApi);
    });
  });

  describe('HTTP Methods', () => {
    it('should perform GET request successfully', async () => {
      const response = await api.get('/users');
      
      expect(response.status).toBe(200);
      expect(response.data).toEqual([
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
      ]);
      expect(response.headers).toBeDefined();
      expect(response.statusText).toBe('OK');
    });

    it('should perform POST request successfully', async () => {
      const userData = { name: 'Test User', email: 'test@example.com' };
      const response = await api.post('/users', userData);
      
      expect(response.status).toBe(201);
      expect(response.data).toEqual({
        id: 3,
        name: 'New User',
        email: 'new@example.com'
      });
    });

    it('should perform PUT request successfully', async () => {
      const userData = { name: 'Updated User', email: 'updated@example.com' };
      
      // Mock PUT handler for this test
      server.use(
        http.put('https://api.test.com/users/1', () => {
          return HttpResponse.json(
            { id: 1, ...userData },
            { status: 200 }
          );
        })
      );

      const response = await api.put('/users/1', userData);
      expect(response.status).toBe(200);
      expect(response.data.name).toBe('Updated User');
    });

    it('should perform DELETE request successfully', async () => {
      server.use(
        http.delete('https://api.test.com/users/1', () => {
          return new HttpResponse(null, { status: 204 });
        })
      );

      const response = await api.delete('/users/1');
      expect(response.status).toBe(204);
    });

    it('should perform PATCH request successfully', async () => {
      const patchData = { name: 'Patched User' };
      
      server.use(
        http.patch('https://api.test.com/users/1', () => {
          return HttpResponse.json(
            { id: 1, name: 'Patched User', email: 'john@example.com' },
            { status: 200 }
          );
        })
      );

      const response = await api.patch('/users/1', patchData);
      expect(response.status).toBe(200);
      expect(response.data.name).toBe('Patched User');
    });
  });

  describe('Error Handling', () => {
    it('should handle HTTP errors', async () => {
      await expect(api.get('/error')).rejects.toThrow('HTTP 500: Internal Server Error');
    });

    it('should handle network timeouts', async () => {
      const timeoutApi = new SpeedcastApi({
        baseURL: 'https://api.test.com',
        timeout: 1000 // 1 second timeout
      });

      await expect(timeoutApi.get('/timeout')).rejects.toThrow();
    });

    it('should retry on failure', async () => {
      let attemptCount = 0;
      
      server.use(
        http.get('https://api.test.com/retry-test', () => {
          attemptCount++;
          if (attemptCount < 3) {
            return HttpResponse.json(
              { error: 'Server Error' },
              { status: 500 }
            );
          }
          return HttpResponse.json(
            { success: true },
            { status: 200 }
          );
        })
      );

      const response = await api.get('/retry-test');
      expect(response.status).toBe(200);
      expect(attemptCount).toBe(3);
    });

    it('should not retry on 4xx errors', async () => {
      let attemptCount = 0;
      
      server.use(
        http.get('https://api.test.com/no-retry', () => {
          attemptCount++;
          return HttpResponse.json(
            { error: 'Not Found' },
            { status: 404 }
          );
        })
      );

      await expect(api.get('/no-retry')).rejects.toThrow('HTTP 404: Not Found');
      expect(attemptCount).toBe(1);
    });
  });

  describe('Caching', () => {
    it('should cache GET requests when enabled', async () => {
      const cachedApi = new SpeedcastApi({
        baseURL: 'https://api.test.com',
        cache: true
      });

      let requestCount = 0;
      server.use(
        http.get('https://api.test.com/cached', () => {
          requestCount++;
          return HttpResponse.json(
            { count: requestCount },
            { status: 200 }
          );
        })
      );

      // First request
      const response1 = await cachedApi.get('/cached', { cache: true });
      expect(response1.data.count).toBe(1);

      // Second request should return cached result
      const response2 = await cachedApi.get('/cached', { cache: true });
      expect(response2.data.count).toBe(1);
      expect(requestCount).toBe(1);
    });

    it('should not cache when disabled', async () => {
      let requestCount = 0;
      server.use(
        http.get('https://api.test.com/not-cached', () => {
          requestCount++;
          return HttpResponse.json(
            { count: requestCount },
            { status: 200 }
          );
        })
      );

      // First request
      const response1 = await api.get('/not-cached', { cache: false });
      expect(response1.data.count).toBe(1);

      // Second request should make new request
      const response2 = await api.get('/not-cached', { cache: false });
      expect(response2.data.count).toBe(2);
      expect(requestCount).toBe(2);
    });

    it('should clear cache', async () => {
      let requestCount = 0;
      server.use(
        http.get('https://api.test.com/clear-cache', () => {
          requestCount++;
          return HttpResponse.json(
            { count: requestCount },
            { status: 200 }
          );
        })
      );

      const cachedApi = new SpeedcastApi({
        baseURL: 'https://api.test.com',
        cache: true
      });

      // First request
      await cachedApi.get('/clear-cache', { cache: true });
      expect(requestCount).toBe(1);

      // Clear cache
      cachedApi.clearCache();

      // Next request should make new API call
      await cachedApi.get('/clear-cache', { cache: true });
      expect(requestCount).toBe(2);
    });
  });

  describe('Request Deduplication', () => {
    it('should deduplicate simultaneous requests', async () => {
      let requestCount = 0;
      server.use(
        http.get('https://api.test.com/dedupe', async () => {
          requestCount++;
          await new Promise(resolve => setTimeout(resolve, 100)); // Small delay to simulate async
          return HttpResponse.json(
            { count: requestCount },
            { status: 200 }
          );
        })
      );

      // Make simultaneous requests
      const [response1, response2, response3] = await Promise.all([
        api.get('/dedupe'),
        api.get('/dedupe'),
        api.get('/dedupe')
      ]);

      expect(requestCount).toBe(1);
      expect(response1.data.count).toBe(1);
      expect(response2.data.count).toBe(1);
      expect(response3.data.count).toBe(1);
    });
  });

  describe('URL Building', () => {
    it('should handle absolute URLs', async () => {
      server.use(
        http.get('https://external.api.com/data', () => {
          return HttpResponse.json(
            { external: true },
            { status: 200 }
          );
        })
      );

      const response = await api.get('https://external.api.com/data');
      expect(response.data.external).toBe(true);
    });

    it('should build relative URLs correctly', async () => {
      const response = await api.get('/users');
      expect(response.status).toBe(200);
    });

    it('should handle URLs with and without leading slash', async () => {
      const response1 = await api.get('/users');
      const response2 = await api.get('users');
      
      expect(response1.status).toBe(200);
      expect(response2.status).toBe(200);
    });
  });

  describe('Configuration Updates', () => {
    it('should update base URL', () => {
      api.setBaseURL('https://new-api.com');
      expect(() => api.setBaseURL('https://new-api.com')).not.toThrow();
    });

    it('should update default headers', () => {
      api.setDefaultHeaders({ 'X-Custom-Header': 'test-value' });
      expect(() => api.setDefaultHeaders({ 'Authorization': 'Bearer token' })).not.toThrow();
    });
  });
});