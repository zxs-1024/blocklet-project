module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/api/src/**/__tests__/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  setupFilesAfterEnv: ['<rootDir>/api/src/__tests__/setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/api/src/$1',
  },
};
