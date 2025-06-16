import { SpeedcastApi } from '../../src/index';
import { NextRequest, NextResponse } from 'next/server';

// Mock Next.js environment
jest.mock('next/server', () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    json: jest.fn((data, options) => ({
      json: () => Promise.resolve(data),
      status: options?.status || 200
    }))
  }
}));

describe('Next.js Integration', () => {
  let api: SpeedcastApi;

  beforeEach(() => {
    api = new SpeedcastApi({
      baseURL: 'https://api.test.com'
    });
  });

  it('should work in API routes', async () => {
    // Simulate API route handler
    const GET = async () => {
      try {
        const response = await api.get('/users');
        return NextResponse.json({
          data: response.data,
          status: 'success'
        });
      } catch (error) {
        return NextResponse.json(
          { error: 'Failed to fetch users', status: 'error' },
          { status: 500 }
        );
      }
    };

    const result = await GET();
    expect(result).toBeDefined();
  });

  it('should handle server component usage', async () => {
    // Simulate server component
    const ServerComponent = async () => {
      try {
        const response = await api.get('/users');
        return { users: response.data };
      } catch (error) {
        return { error: 'Failed to load users' };
      }
    };

    const result = await ServerComponent();
    expect(result.users).toBeDefined();
  });
});