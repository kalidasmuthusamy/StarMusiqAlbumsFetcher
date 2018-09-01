var path = require('path');
var webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');
var Dotenv = require('dotenv-webpack');

module.exports = {
  devtool: 'source-map',
  entry: [
    'babel-polyfill',
    // 'webpack-dev-server/client?http://localhost:3000',
    './src/index.jsx'
  ],
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/build/'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel-loader'],
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.scss$/,
        loaders: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  },
  plugins: [
    new Dotenv({
      path: '../.env',
      silent: false,
    }),
    new webpack.optimize.UglifyJsPlugin(),
    new CompressionPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8
    }),
  ]
}
