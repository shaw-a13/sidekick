module.exports = {
  preset: "ts-jest",
  reporters: [
    "default",
    ["jest-junit", { outputDirectory: "test-reports/" }],
    [
      "./node_modules/jest-html-reporter",
      {
        pageTitle: "CDK Test Report",
        includeFailureMsg: true,
        includeConsoleLog: true,
      },
    ],
  ],
  testEnvironment: "jsdom",
  testRunner: "jest-circus/runner",
  coveragePathIgnorePatterns: ["__tests__/util", "test/helpers"],
  testPathIgnorePatterns: ["__tests__/util", ".*mock.*"],
  coverageDirectory: "test-reports/",
  setupFilesAfterEnv: ["jest-extended/all"],
  moduleNameMapper: {
    "\\.(css|scss|png|jpg)$": "<rootDir>/__mocks__/mock.js",
  },
};
