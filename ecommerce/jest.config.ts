import nextJest from 'next/jest';
import type { Config } from 'jest';

const createJestConfig = nextJest({
  dir: './', // Caminho para o seu projeto Next.js
});

const customJestConfig: Config = {
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'],
};

export default createJestConfig(customJestConfig);
