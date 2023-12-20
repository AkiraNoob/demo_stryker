/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/**/*.test.ts'],
  forceExit: true,
  verbose: true,
  clearMocks: true,
  setupFiles: ['<rootDir>/.jest/setEnv.ts'],
  coverageDirectory: 'reports/coverage',
  testTimeout: 5000,
};
