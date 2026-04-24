// @ts-check
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";

export default tseslint.config(
  // Base TypeScript recommended rules
  ...tseslint.configs.recommended,

  // React + React Hooks
  {
    plugins: {
      react: pluginReact,
      "react-hooks": pluginReactHooks,
    },
    rules: {
      ...pluginReact.configs.recommended.rules,
      ...pluginReactHooks.configs.recommended.rules,
      // React 17+ JSX transform — no need to import React in scope
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
    },
    settings: {
      react: { version: "detect" },
    },
  },

  // Project-specific rules
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },

  // Ignore generated / build output
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "public/mockServiceWorker.js",
      "scripts/**",
      "postcss.config.mjs",
      "eslint.config.mjs",
    ],
  }
);
