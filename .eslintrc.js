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
    "@typescript-eslint/ban-ts-comment": "warn",
    "@typescript-eslint/camelcase": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "react/prop-types": "off", // TypeScript will take care of prop validation
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/no-empty-function": "warn",
    "@typescript-eslint/ban-types": "warn",
  },
  settings: {
    react: {
      pragma: "React",
      version: "detect"
    }
  },
  parser: "@typescript-eslint/parser"
};
