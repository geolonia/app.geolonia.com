module.exports = {
  extends: [
    "react-app",
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  plugins: ["react", "@typescript-eslint"],
  env: {
    browser: true,
    jest: true
  },
  rules: {
    "no-console": "warn",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/camelcase": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "react/prop-types": "off", // TypeScript will take care of prop validation
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/ban-types": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
  },
  settings: {
    react: {
      pragma: "React",
      version: "detect"
    }
  },
  parser: "@typescript-eslint/parser"
};
