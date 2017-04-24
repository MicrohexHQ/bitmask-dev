var path = require('path')
var webpack = require('webpack')
var CopyWebpackPlugin = require('copy-webpack-plugin');

var config = {
  context: path.join(__dirname, 'app'),
  entry: ['babel-polyfill', './main.js'],
  output: {
    path: path.join(__dirname, 'pydist', 'leap', 'bitmask_js', 'public'),
    filename: 'app.bundle.js'
  },
  resolve: {
    modulesDirectories: ['node_modules', './app'],
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      // babel transform
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['react', 'es2015']
        }
      },
      {
        test: /\.css$/,
        loader: "style!css"
      },
      {
        test: /\.less$/,
        loader: "style!css!less?noIeCompat"
      },
      {
        test: /\.png$/,
        loader: "file-loader"
      },
      {
        test: /\.jpg$/,
        loader: "file-loader"
      },
      {
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader'
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader'
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader'
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader'
      }
    ]
  },
  plugins: [
    // don't bundle when there is an error:
    new webpack.NoErrorsPlugin(),

    // https://webpack.github.io/docs/code-splitting.html
    // new webpack.optimize.CommonChunkPlugin('common.js')

    //
    // ASSETS
    //
    // If you make changes to the asset files, you will need to stop then rerun
    // `npm run watch` for the changes to take effect.
    //
    // For more information: https://github.com/kevlened/copy-webpack-plugin
    //
    new CopyWebpackPlugin([
      { from: 'img/*'},
      { from: 'index.html' },
      { from: '../node_modules/zxcvbn/dist/zxcvbn.js', to: 'js' }
    ])
  ],
  stats: {
    colors: true
  },
  // source-map can be used in production or development
  // but it creates a separate file.
  devtool: 'source-map'
}

/*
if (process.env.NODE_ENV == 'production') {
  // see https://github.com/webpack/docs/wiki/optimization
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false },
      output: { comments: false }
    }),
    new webpack.optimize.DedupePlugin()
  )
} else {
  config.devtool = 'inline-source-map';
}
*/

module.exports = config
