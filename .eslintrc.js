module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
    jest: true
  },
  extends: ["eslint:recommended", "plugin:react/recommended"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2018
  },
  rules: {
    "no-console": "off",
    "no-unused-vars": "off"
  }
};
