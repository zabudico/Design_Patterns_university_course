import js from "@eslint/js";
import js from "@eslint/jsdoc";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js, jsdoc },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
    // rules: {
    //   "jsdoc/no-undefined-types": "error",
    // },
  },
]);
