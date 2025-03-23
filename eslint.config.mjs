import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";

export default defineConfig([
  { 
    ignores: ["dist/**", "node_modules/**"],
    files: ["**/*.{js,mjs,cjs}"] 
  },
  { files: ["**/*.{js,mjs,cjs}"], languageOptions: { globals: globals.browser } },
  { files: ["**/*.{js,mjs,cjs}"], plugins: { js }, extends: ["js/recommended"] },
  { files: ["**/*.{js,mjs,cjs}"], rules: {
    "no-unused-vars": "warn",
  } },
]);
