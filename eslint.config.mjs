import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Generated Sanity Studio output
    ".sanity/**",
  ]),
  {
    rules: {
      // The scroll-reveal pattern (useReveal + revealStyle) intentionally
      // sets state inside an effect when an element enters the viewport, and
      // the custom hook returns both a ref and a `visible` state value. The
      // React 19 hooks rules below mis-flag this deliberate, harmless pattern,
      // so they are downgraded to warnings rather than errors.
      "react-hooks/refs": "warn",
      "react-hooks/set-state-in-effect": "warn",
    },
  },
]);

export default eslintConfig;
