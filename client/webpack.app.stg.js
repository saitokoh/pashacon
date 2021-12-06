const path = require('path');
const merge = require('webpack-merge') // webpack-merge
const common = require('./webpack-conf/webpack.common.js') // 汎用設定をインポート
const app = require('./webpack-conf/webpack.app.conf.js') // アプリの設定をインポート

module.exports = merge(common, app, {
  mode: 'development',
  devtool: 'inline-source-map',
});