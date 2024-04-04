module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: './e2e',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  setupFilesAfterEnv: ['../setupTests.js'],
  testEnvironment: 'node',
};
