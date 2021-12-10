const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
require('@babel/register');


module.exports = {
  entry: {
    'index': './src/index.js'
  },
  module: {
    rules: [
      {
        test: /\.(sc|c)ss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              url: false,
              modules: true
            }
          },
          'sass-loader'
        ]
      }
    ]
  },
  resolve: {
    modules: [
      path.resolve('./src')
    ]
  },
  plugins: [
    new CopyPlugin([
      {
        from: './src/assets/images',
        to: path.resolve('../public/images')
      },
      {
        from: './src/index.html',
        to: path.resolve('../public/index.html')
      },
      {
        from: './src/404.html',
        to: path.resolve('../public/404.html')
      },
      {
        from: './src/500.html',
        to: path.resolve('../public/500.html')
      },
      {
        from: './src/style.css',
        to: path.resolve('../public/style.css')
      }
    ]),
  ]
};