import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import nextPlugin from '@next/eslint-plugin-next';

export default [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "public/sw.js",
      "tailwind.config.js",
      // Node.js utility scripts
      "db-migrate/**",
      "server-seed.js",
      "vercel-cache-clear.js",
      "src/lib/ai/verify-keys.ts",
      // Standalone Express/Node bridge deployed separately (not part of Next.js app)
      "trendaryo-bridge/**",
      // Browser widget script (uses `document`) and Node CLI scripts
      "public/widget/**",
      "scripts/**",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "no-empty": "off",
      "no-useless-escape": "off",
      "prefer-const": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-unused-expressions": "off",
    },
  },
  {
    files: ["src/lib/ai/verify-keys.ts", "src/lib/ai/zai.ts"],
    rules: {
      "no-var": "off",
      "no-useless-catch": "off",
    },
  },
];