import 'jest-extended';
import '@testing-library/jest-dom';
import { server } from './mocks/server';

// Mock server setup
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Global test utilities
global.console = {
  ...console,
  // Uncomment to ignore specific log levels during tests
  // warn: jest.fn(),
  // error: jest.fn(),
};