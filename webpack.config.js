const path = require('path');
const EslintWebpackPlugin = require('eslint-webpack-plugin');
const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: './src/index',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'index.js',
    publicPath: '/',
    // Retain export of prepareData function for both - browser and Node.js
    library: {
      type: 'umd',
    },
    globalObject: 'this',
  },
  plugins: [
    new EslintWebpackPlugin(),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new UglifyjsWebpackPlugin(),
    ],
  },
  mode: 'production',
};
