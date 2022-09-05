module.exports = {
  rootDir: './src',
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/$1',
  },
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePaths: ['<rootDir>/src'],
}