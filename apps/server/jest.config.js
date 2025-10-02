module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src", "<rootDir>/src/tests"],
  testMatch: [
    "**/__tests__/**/*.(test|spec).ts",
    "**/?(*.)+(test|spec).ts"
  ],
  // setupFilesAfterEnv: ["<rootDir>/tests/setup/jest.setup.ts"],
};
