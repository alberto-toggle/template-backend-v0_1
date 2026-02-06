import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  rootDir: '.',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.jest.json'
      }
    ]
  },
  transformIgnorePatterns: ['/node_modules/(?!(@prisma)/)'],
  moduleNameMapper: {
    '^@src/(.*)\\.js$': '<rootDir>/src/$1.ts',
    '^@src/(.*)$': '<rootDir>/src/$1',
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  testMatch: ['**/tests/**/*.test.ts'],
  collectCoverageFrom: ['src/**/*.ts', '!src/index.ts']
};

export default config;
