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
  "input": "src/web.js",
  "output": {
    "file": "dist/valley-module-web.js",
    "name": "ValleyModule",
    "format": "umd"
  },
  "context": "window",
  "plugins": [
    babel(babelOption)
  ]
}
