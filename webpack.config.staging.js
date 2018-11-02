const Webpack                 = require('webpack');
const HtmlWebpackPlugin       = require('html-webpack-plugin');
const Path                    = require('path');
const MiniCssExtractPlugin    = require('mini-css-extract-plugin');
const RobotstxtPlugin         = require('robotstxt-webpack-plugin').default;
const FaviconsWebpackPlugin   = require('favicons-webpack-plugin');
const Dotenv                  = require('dotenv-webpack');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const WebpackPwaManifest      = require('webpack-pwa-manifest');

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: {
    app: [
      '@babel/polyfill',
      './src/javascripts/app/entry.js'
    ]
  },
  mode: 'production',
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
    new Dotenv({
      path: './.env.staging',
      safe: true
    }),
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
      environment: 'staging',
      filename: 'index.html',
      hash: true,
      template: './src/javascripts/app/index.ejs'
    }),
    new FaviconsWebpackPlugin('./favicon.png'),
    new MiniCssExtractPlugin({
      filename: 'styles-[name].css'
    }),
    new RobotstxtPlugin({
      policy: [
        {
          disallow: '/',
          userAgent: '*'
        }
      ]
    }),
    new SWPrecacheWebpackPlugin({
      // By default, a cache-busting query parameter is appended to requests
      // used to populate the caches, to ensure the responses are fresh.
      // If a URL is already hashed by Webpack, then there is no concern
      // about it being stale, and the cache-busting can be skipped.
      dontCacheBustUrlsMatching: /\.\w{8}\./u,
      filename: 'service-worker.js',
      logger(message) {
        if (message.indexOf('Total precache size is') === 0) {
          // This message occurs for every build and is a bit too noisy.
          return;
        }
        if (message.indexOf('Skipping static resource') === 0) {
          // This message obscures real errors so we ignore it.
          // https://github.com/facebook/create-react-app/issues/2612
          return;
        }
        /* eslint-disable no-console */
        console.log(message);
        /* eslint-enable no-console */
      },
      minify: true,
      // Don't precache sourcemaps (they're large) and build asset manifest:
      staticFileGlobsIgnorePatterns: [/\.map$/u, /asset-manifest\.json$/u]
      // `navigateFallback` and `navigateFallbackWhitelist` are disabled by
      // default
      // navigateFallback: publicUrl + '/index.html',
      // navigateFallbackWhitelist: [/^(?!\/__).*/],
    }),
    /* eslint-disable camelcase */
    new WebpackPwaManifest({
      background_color: '#ffffff',
      description: 'Track your time',
      icons: [
        {
          size: '192x192',
          src: Path.resolve(__dirname, './src/images/icon.png')
        }, {
          size: '512x512',
          src: Path.resolve(__dirname, './src/images/splash.png')
        }
      ],
      name: 'Hours Tracker',
      short_name: 'Hours Tracker',
      theme_color: '#4e8eb2'
    })
    /* eslint-enable camelcase */
  ],
  resolve: {
    modules: [Path.resolve(__dirname, './src'), 'node_modules']
  }
};
