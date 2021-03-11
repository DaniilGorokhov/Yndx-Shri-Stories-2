const path = require('path');
const EslintWebpackPlugin = require('eslint-webpack-plugin');
const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: './src/index',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'index.js',
    publicPath: '/',
  },
  devtool: 'inline-source-map',
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
