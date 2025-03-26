import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";

export default defineConfig([
  {
    files: ["/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      indent: ["error", 2], // Enforce 2-space indentation (change to 4 if needed)
    },
  },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
]);
