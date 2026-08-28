module.exports = {
  root: true,
  extends: [
    '@geolonia/eslint-config',
  ],
  env: {
    browser: true,
    node: true,
    jest: true,
  },
  parserOptions: {
    project: './tsconfig.json',
  },
};
