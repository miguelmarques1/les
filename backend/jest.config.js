/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  moduleNameMapper: {
    "^@services/(.*)$": "<rootDir>/src/domain/services/$1",
  },
  testEnvironment: "node",
  maxWorkers: 1,
};
