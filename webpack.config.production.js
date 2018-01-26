const Webpack               = require('webpack');
const HtmlWebpackPlugin     = require('html-webpack-plugin');
const Path                  = require('path');
const ExtractTextPlugin     = require('extract-text-webpack-plugin');
const RobotstxtPlugin       = require('robotstxt-webpack-plugin').default;
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const Dotenv                = require('dotenv-webpack');

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: {
    app: [
      'babel-polyfill',
      './src/javascripts/app/entry.js'
    ]
  },
  module: {
    loaders: [
      {
        exclude: [/node_modules/],
        test: /\.js$/,
        use: ['babel-loader']
      }, {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
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
        })
      }, {
        oneOf: [
          {
            resourceQuery: /main/, // foo.css?inline
            use: ExtractTextPlugin.extract({
              fallback: 'style-loader',
              use: [
                'css-loader',
                'postcss-loader',
                {
                  loader: 'sass-loader',
                  options: {
                    includePaths: [Path.resolve(__dirname, './src/stylesheets')]
                  }
                }
              ]
            })
          }, {
            use: ExtractTextPlugin.extract({
              fallback: 'style-loader',
              use: [
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
            })
          }
        ],
        test: /\.s(a|c)ss$/
      }, {
        test: /\.(woff|woff2|eot|ttf|svg)(\?.*$|$)/,
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
        test: /\.(png|jpg|gif|jpeg)$/,
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
    new Dotenv({
      path: './.env.production',
      safe: true
    }),
    new Webpack.ProvidePlugin({
      /* eslint-disable id-length */
      $: 'jquery',
      /* eslint-enable id-length */
      jQuery: 'jquery',
      jquery: 'jquery'
    }),
    new Webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new HtmlWebpackPlugin({
      chunks: ['app'],
      environment: 'production',
      filename: 'index.html',
      hash: true,
      template: './src/javascripts/app/index.ejs'
    }),
    new FaviconsWebpackPlugin('./favicon.png'),
    new ExtractTextPlugin('styles-[name].css'),
    new RobotstxtPlugin({
      policy: [
        {
          disallow: '/',
          userAgent: '*'
        }
      ]
    })
  ],
  resolve: {
    modules: [Path.resolve(__dirname, './src'), 'node_modules']
  }
};
