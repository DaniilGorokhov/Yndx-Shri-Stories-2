module.exports = {
  env: {
    browser: true,
    node: true,
    'jest/globals': true,
  },
  extends: [
    'airbnb-base',
    'plugin:jest/recommended',
    'plugin:jest/style',
  ],
  plugins: [
    'jest',
  ],
};
