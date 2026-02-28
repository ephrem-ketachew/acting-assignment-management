import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
    ...nextVitals,
    ...nextTs,
    globalIgnores([
        ".next/**",
        "out/**",
        "build/**",
        "node_modules/**",
        "next-env.d.ts",
    ]),
    {
        files: ["**/*.{js,jsx,ts,tsx}"],
        rules: {
            "no-console": ["error", { allow: ["warn", "error"] }],
            "eqeqeq": ["error", "always"],
            "max-lines": ["warn", { max: 500, skipBlankLines: true, skipComments: true }],
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": [
                "error",
                { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
            ],
        },
    },
]);

export default eslintConfig;
