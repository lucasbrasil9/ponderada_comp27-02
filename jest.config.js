module.exports = {
  testEnvironment: "node",
  verbose: true,
  roots: ["<rootDir>/tests"],
  collectCoverageFrom: ["src/**/*.js", "utils/**/*.js"],
  coverageDirectory: "reports/coverage"
};
