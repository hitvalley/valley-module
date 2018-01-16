import babel from 'rollup-plugin-babel';

const babelOption = {
  babelrc: false,
  presets: [
    [
      "env",
      {
        "modules": false
      }
    ]
  ],
  plugins: [
    "external-helpers"
  ]
};

export default {
  "input": "src/index.js",
  "output": {
    "file": "dist/valley-module.js",
    "format": "umd",
    "name": "ValleyModule"
  },
  "context": "window",
  "plugins": [
    babel(babelOption)
  ]
}
