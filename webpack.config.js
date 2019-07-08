/**
 * Webpack Configuration
 * @type {file}
 */

const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const { NODE_ENV } = process.env
const IS_PROD = NODE_ENV === 'production'

const ENV = {
  NODE_ENV: NODE_ENV === 'production' ? '"production"' : '"development"',
  USER_KEYS_API_URL: process.env.USER_KEYS_API_URL,
  AWS_REGION: process.env.AWS_REGION,
  AWS_COGNITO_USER_POOL_ID:
    process.env.AWS_COGNITO_USER_POOL_ID,
  AWS_COGNITO_USER_POOL_CLIENT_ID:
    process.env.AWS_COGNITO_USER_POOL_CLIENT_ID
}

module.exports = {
  mode: IS_PROD ? 'production' : 'development',
  entry: {
    uikit: './node_modules/uikit/dist/js/uikit.min.js',
    'uikit-icons': './node_modules/uikit/dist/js/uikit-icons.min.js',
    app: ['@babel/polyfill', 'src/entries/app.js'],
    top: ['@babel/polyfill', 'src/entries/top.js']
  },

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
            options: { sourceMap: IS_PROD }
          },
          {
            loader: 'css-loader',
            options: { sourceMap: IS_PROD }
          },
          {
            loader: 'sass-loader',
            options: { sourceMap: IS_PROD }
          }
        ]
      }
      // {
      //   test: /\.jpe?g$|\.ico$|\.gif$|\.png$|\.svg$|\.woff$|\.ttf$|\.wav$|\.mp3$/,
      //   loader: 'file-loader?name=[name].[ext]'
      // }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public', 'app.html'),
      chunks: ['uikit', 'uikit-icons', 'app'],
      filename: 'app/index.html'
    }),

    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public', 'top.html'),
      chunks: ['uikit', 'uikit-icons', 'top'],
      filename: 'index.html'
    }),

    new CopyWebpackPlugin([
      { from: './node_modules/uikit/dist/css/uikit.min.css', to: 'uikit.min.css' },
      { from: './public/images', to: 'images' },
      { from: './public/manifest.json', to: 'manifest.json' },
      { from: './public/icon.png', to: 'icon.png' }
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
    port: 3000,
    historyApiFallback: {
      rewrites: [
        { from: /^\/app/, to: '/app' },
      ]
    },
    hot: true,
    open: true
  }
}
