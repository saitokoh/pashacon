const path = require('path');
require('@babel/register');

const ASSET_PATH = process.env.ASSET_PATH || '/';

module.exports = {
  output: {
      path: path.resolve('../public') ,
      publicPath: '/',
      filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules\/(?!(dom7|swiper)\/).*/,
        loader: 'babel-loader'
      },
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', 'scss'],
    modules: [
      path.resolve('./node_modules'),
      path.resolve('./local_modules'),
    ]
  },
};