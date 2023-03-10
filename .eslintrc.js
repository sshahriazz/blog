module.exports = {
  extends: [
    "next",
    "plugin:prettier/recommended",
    "next/core-web-vitals",
    "plugin:react-hooks/recommended",
  ],
  plugins: ["unused-imports", "prettier", "react-hooks"],
  rules: {
    "react-hooks/exhaustive-deps": 0,
    "prettier/prettier": [
      "error",
      {
        tabWidth: 2,
        useTabs: false,
      },
    ],
    "@next/next/no-html-link-for-pages": "off",
    "react/display-name": "off",
    eqeqeq: ["error", "always"],
    "prefer-const": "error",
    "object-shorthand": ["error", "always"],
    curly: "error",
    "padding-line-between-statements": [
      "error",
      { blankLine: "always", prev: "*", next: "return" },
    ],

    "no-unused-vars": "off",
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      0,
      {
        vars: "all",
        varsIgnorePattern: "^_",
        args: "after-used",
        argsIgnorePattern: "^_",
      },
    ],
  },
};
