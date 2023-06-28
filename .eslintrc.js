module.exports = {
  extends: [
    '@geolonia',
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
