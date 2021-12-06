const path = require('path');
const merge = require('webpack-merge') // webpack-merge
const common = require('./webpack-conf/webpack.common.js') // 汎用設定をインポート
const app = require('./webpack-conf/webpack.app.conf.js') // アプリの設定をインポート

module.exports = merge(common, app,  {
  watch: true,
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.resolve('../public') ,
    compress: true,
    hot: true,
    host: '0.0.0.0',
    disableHostCheck: true,
    port: 80,
    proxy: {
      '*': 'http://nginx:8080'
    }
  },
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000
  },
  output: {
    publicPath: '/'
  }
});