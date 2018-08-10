var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
var WebpackShellPlugin = require('webpack-shell-plugin');

var routers = require('./routers.deploy.json').routers;

var entry = {};
routers.forEach((r) => {
  entry[r.name] = r.entry;
});
var plugins = routers.map(r => new HtmlWebpackPlugin({
  template: r.template,
  filename: r.filename,
  chunks: [r.name, 'vendors'],
  inject: 'body'
}));

var config = {
  context: path.join(__dirname, '..', '/src'),
  entry,
  output: {
    path: path.join(__dirname, '..', '/dist/staging/assets'),
    filename: '[name].[chunkhash:8].js',
    publicPath: 'https://assets.bitrabbit.com/dashboard/staging/'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      __DEV__: process.env.NODE_ENV !== 'production', // judge if dev environment.
      __ENV__: JSON.stringify('staging'),
    }),
    new uglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.optimize.MinChunkSizePlugin({ minChunkSize: 20000 }),
    new webpack.optimize.OccurenceOrderPlugin(false),
    new webpack.optimize.AggressiveMergingPlugin({
      minSizeReduce: 1.5,
      moveToParents: true
    }),
    new CommonsChunkPlugin('vendors', 'vendors.[chunkhash:8].js', Infinity),
    new ExtractTextPlugin("[name].[chunkhash:8].css"),
    new webpack.optimize.DedupePlugin(),
    new WebpackShellPlugin({
      onBuildExit: [
        'echo',
        'echo ==============',
        'echo      WORK',
        'echo ==============',
        'echo',
        'node webpack/deploy.js',
      ]
    })
  ].concat(plugins),
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "babel"
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss')
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss!sass')
      },
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss!less')
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        loader: 'url?limit=10000!img?progressive=true'
      },
      {
        test: /\.data$/i,
        loader: 'url'
      },
      {
        test: /\.(eot|woff|woff2|ttf|svg)$/,
        loader: 'url?limit=10000'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.html$/,
        loader: 'html?attrs[]=img:src',
      }
    ]
  },
  resolve: {
    // 設定後只需要寫 require('file') 而不用寫成 require('file.jsx')
    extensions: ['', '.js', '.jsx', '.json']
  },
  externals: {
    lodash: "_",
    jquery: "jQuery",
    react: "React",
    'react-dom': "ReactDOM"
  },
};

module.exports = config;
