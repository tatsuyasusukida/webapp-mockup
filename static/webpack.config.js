const path = require('path')

module.exports = {
  mode: 'development', // <1>
  target: ['web', 'es5'], // <2>
  entry: { // <3>
    'vue': './src/vue.js',
    'app': './src/app.js',
  },
  output: {
    path: path.join(__dirname, 'dist'), // <4>
    filename: 'js/[name].js', // <5>
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js', // <6>
    },
  },
  devtool: false, // <7>
  devServer: {
    port: 8080, // <8>
    static: {
      directory: path.join(__dirname, 'public'), // <9>
    },
    hot: false, // <10>
    client: false, // <11>
    liveReload: false, // <12>
  },
}
