import { SpeedcastApi } from '../src/index';

describe('Request Cache', () => {
  let api: SpeedcastApi;

  beforeEach(() => {
    api = new SpeedcastApi({
      baseURL: 'https://api.test.com',
      cache: true,
      cacheTTL: 1000 // 1 second
    });
  });

  afterEach(() => {
    api.clearCache();
  });

  it('should cache responses with TTL', async () => {
    let requestCount = 0;
    
    // Mock handler that tracks request count
    const handler = jest.fn((req, res, ctx) => {
      requestCount++;
      return res(ctx.status(200), ctx.json({ count: requestCount }));
    });

    // First request
    const response1 = await api.get('/test', { cache: true });
    expect(response1.data.count).toBe(1);

    // Second request within TTL - should return cached
    const response2 = await api.get('/test', { cache: true });
    expect(response2.data.count).toBe(1);

    // Wait for cache to expire
    await new Promise(resolve => setTimeout(resolve, 1100));

    // Third request after TTL - should make new request
    const response3 = await api.get('/test', { cache: true });
    expect(requestCount).toBe(2);
  });
});