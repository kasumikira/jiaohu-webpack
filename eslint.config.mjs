import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";

export default defineConfig({
  ignores: ["dist/**", "node_modules/**"],
  files: ["**/*.{js,mjs,cjs}"],
  plugins: {
    js,
  },
  extends: [
    "js/recommended",
  ],
  languageOptions: {
    globals: {
      ...globals.browser,
      unsafeWindow: "readonly",
    },
  },
  rules: {
    "no-unused-vars": "warn",
  }
});
