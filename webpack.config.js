/**
 * Webpack Configuration
 * @type {file}
 */

const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const { NODE_ENV } = process.env
const IS_PROD = NODE_ENV === 'production'

const ENV = {
  NODE_ENV,
  PUBLIC_URL: 'test',
  REACT_APP_USER_KEYS_API_URL: process.env.REACT_APP_USER_KEYS_API_URL,
  REACT_APP_AWS_REGION: process.env.REACT_APP_AWS_REGION,
  REACT_APP_AWS_COGNITO_USER_POOL_ID:
    process.env.REACT_APP_AWS_COGNITO_USER_POOL_ID,
  REACT_APP_AWS_COGNITO_USER_POOL_CLIENT_ID:
    process.env.REACT_APP_AWS_COGNITO_USER_POOL_CLIENT_ID
}

module.exports = {
  mode: IS_PROD ? 'production' : 'development',
  entry: ['@babel/polyfill', 'src/index.js'],

  output: {
    path: path.join(__dirname, '/build/'),
    publicPath: '/',
    filename: '[name]-[hash].bundle.js'
  },

  devtool: IS_PROD ? void 0 : 'source-map',

  resolve: {
    modules: [__dirname, 'node_modules'],
    extensions: ['.js']
  },

  module: {
    rules: [
      {
        exclude: /(node_modules|bower_components)/,
        test: /.jsx?$/,
        use: [{ loader: 'babel-loader' }]
      },
      {
        test: /\.(scss|css)$/,
        use: [
          {
            loader: 'style-loader',
            options: { sourceMap: true }
          }, // creates style nodes from JS strings
          {
            loader: 'css-loader',
            options: { sourceMap: true }
          }, // translates CSS into CommonJS
          {
            loader: 'sass-loader',
            options: { sourceMap: true }
          } // compiles Sass to CSS
        ]
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({ template: './public/index.html' }),

    new CopyWebpackPlugin([
      { from: './public/images', to: 'images' },
      { from: './public/manifest.json', to: 'manifest.json' },
      { from: './public/icon.png', to: 'icon.png' },
      {
        from: './node_modules/uikit/dist/js/uikit.min.js',
        to: 'uikit/index.min.js'
      },
      {
        from: './node_modules/uikit/dist/js/uikit-icons.min.js',
        to: 'uikit/icons.min.js'
      }
    ]),

    new webpack.DefinePlugin({
      __ENV__: JSON.stringify(ENV)
    })
  ],

  devServer: {
    contentBase: path.join(__dirname, '/build/'),
    compress: true,
    https: false,
    host: '0.0.0.0',
    port: 4000,

    // respond to 404s with index.html
    historyApiFallback: true,

    // enable HMR on the server
    hot: true
  }
}
