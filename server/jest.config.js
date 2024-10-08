const tsconfig = require("./tsconfig.json")

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  restoreMocks: true,

  // https://kulshekhar.github.io/ts-jest/docs/getting-started/paths-mapping/
  roots: ["<rootDir>"],
  modulePaths: [tsconfig.compilerOptions.baseUrl],
}
