import { defineConfig } from "oxlint";

export default defineConfig({
  plugins: ["typescript", "unicorn", "oxc", "import", "react"],
  categories: {
    correctness: "error",
    suspicious: "error",
  },
  ignorePatterns: ["**/dist/**", "backend/src/generated/**", "frontend/src/api/generated/**"],
  rules: {
    "typescript/no-floating-promises": "error",
    "typescript/no-explicit-any": "error",
    "no-console": "error",
    eqeqeq: "error",
    "func-style": ["error", "expression"],
    "prefer-arrow-callback": "error",
    "typescript/consistent-type-definitions": ["error", "type"],
    "react/react-in-jsx-scope": "off",
    "typescript/consistent-return": "off",
  },
});
