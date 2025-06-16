import { SpeedcastApi } from '../src/index';

describe('Rate Limiter', () => {
  it('should enforce rate limits', async () => {
    const api = new SpeedcastApi({
      baseURL: 'https://api.test.com',
      rateLimit: {
        requests: 2,
        window: 1000 // 1 second
      }
    });

    const startTime = Date.now();
    
    // Make 3 requests (should be rate limited on the 3rd)
    await api.get('/users');
    await api.get('/users');
    await api.get('/users'); // This should be delayed
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // Should take at least 1 second due to rate limiting
    expect(duration).toBeGreaterThan(900);
  });
});