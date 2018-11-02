const Webpack               = require('webpack');
const HtmlWebpackPlugin     = require('html-webpack-plugin');
const Path                  = require('path');
const MiniCssExtractPlugin  = require('mini-css-extract-plugin');
const StyleLintPlugin       = require('stylelint-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const Dotenv                = require('dotenv-webpack');

module.exports = {
  devServer: {
    historyApiFallback: {
      rewrites: [{ from: /^\/$/u, to: '/index.html' }]
    },
    host: '0.0.0.0',
    inline: false
  },
  devtool: 'eval',
  entry: {
    app: [
      '@babel/polyfill',
      './src/javascripts/app/entry.js'
    ]
  },
  mode: 'development',
  module: {
    rules: [
      {
        enforce: 'pre',
        exclude: [/node_modules/u],
        test: /\.js$/u,
        use: ['eslint-loader']
      }, {
        exclude: [/node_modules/u],
        test: /\.js$/u,
        use: ['babel-loader']
      }, {
        test: /\.css$/u,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              localIdentName: '[name]__[local]_[hash:base64:5]',
              modules: true
            }
          },
          'postcss-loader'
        ]
      }, {
        oneOf: [
          {
            resourceQuery: /main/u, // foo.css?inline
            use: [
              MiniCssExtractPlugin.loader,
              'css-loader',
              'postcss-loader',
              {
                loader: 'sass-loader',
                options: {
                  includePaths: [Path.resolve(__dirname, './src/stylesheets')]
                }
              }
            ]
          }, {
            use: [
              MiniCssExtractPlugin.loader,
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 2,
                  localIdentName: '[name]__[local]_[hash:base64:5]',
                  modules: true
                }
              },
              'postcss-loader',
              {
                loader: 'sass-loader',
                options: {
                  includePaths: [Path.resolve(__dirname, './src/stylesheets')]
                }
              }
            ]
          }
        ],
        test: /\.s(a|c)ss$/u
      }, {
        test: /\.(woff|woff2|eot|ttf|svg)(\?.*$|$)/u,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: '8192',
              name: '[name].[ext]'
            }
          }
        ]
      }, {
        test: /\.(png|jpg|gif|jpeg)$/u,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: '8192',
              name: '[name].[ext]'
            }
          }
        ]
      }
    ]
  },
  output: {
    filename: 'bundle-[name].js',
    path: Path.join(__dirname, 'dist'),
    publicPath: '/'
  },
  plugins: [
    new Dotenv({ safe: true }),
    new Webpack.ProvidePlugin({
      /* eslint-disable id-length */
      $: 'jquery',
      /* eslint-enable id-length */
      jQuery: 'jquery',
      jquery: 'jquery'
    }),
    new Webpack.IgnorePlugin(/^\.\/locale$/u, /moment$/u),
    new HtmlWebpackPlugin({
      chunks: ['app'],
      environment: 'development',
      filename: 'index.html',
      hash: true,
      template: './src/javascripts/app/index.ejs'
    }),
    new FaviconsWebpackPlugin('./favicon.png'),
    new StyleLintPlugin(),
    new MiniCssExtractPlugin({
      filename: 'styles-[name].css'
    })
  ],
  resolve: {
    modules: [Path.resolve(__dirname, './src'), 'node_modules']
  }
};
