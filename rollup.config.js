import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import minimist from 'minimist';

const options = minimist(process.argv.slice(2));

console.log(options)

export default {
  input: 'src/valley-module.js',
  output: {
    file: 'demo/vm.js',
    format: options.format || 'cjs'
  },
  plugins: [
    resolve(),
    babel({
      exclude: 'node_module/**'
    })
  ]
}
