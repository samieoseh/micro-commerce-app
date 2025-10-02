module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src", "<rootDir>/src/tests"],
  setupFiles: ["<rootDir>/jest.setup.ts"], 
  testMatch: [
    "**/__tests__/**/*.(test|spec).ts",
    "**/?(*.)+(test|spec).ts"
  ],
};