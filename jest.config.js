module.exports = {
    testEnvironment: 'jsdom',  // Use jsdom environment for DOM-related tests
    transform: {
      '^.+\\.(js|jsx)$': 'babel-jest',
    },
    moduleNameMapper: {
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
      '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
    },
    transformIgnorePatterns: [
      '/node_modules/(?!(chartjs-adapter-date-fns|chart.js)/)',
    ],
  };
  