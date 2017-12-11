const rollup = require("rollup");
const babel = require("rollup-plugin-babel");

rollup.rollup({
  entry: 'src/index.js',
  plugins: [
    babel()
  ]
}).then(function(dist){
  dist.write({
    dest: 'dist/main.js',
    format: 'cmd'
  });
});
