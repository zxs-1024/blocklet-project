import { jest } from '@jest/globals';

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.BLOCKLET_PORT = '3030';

// Reset profile data before each test
beforeEach(() => {
  // Clear any test data
  jest.clearAllMocks();
});
