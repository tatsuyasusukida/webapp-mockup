const path = require('path')

module.exports = {
  mode: 'development',
  target: ['web', 'es5'],
  entry: {
    'vue': './src/vue.js',
    'app': './src/app.js',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'js/[name].js',
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
    },
  },
  devtool: false,
  devServer: {
    port: 8080,
    static: {
      directory: path.join(__dirname, 'public'),
    },
    hot: false,
    client: false,
    liveReload: false,
  },
}
