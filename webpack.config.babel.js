
import _ from 'lodash';

import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';

import autoprefixer from 'autoprefixer';
import assets from 'postcss-assets';
import svgo from 'postcss-svgo';


let config = {
  entry: './src/index',
  output: {path: './dist', filename: 'bundle.js'},
  plugins: [
    new HtmlWebpackPlugin({template: './src/index.html'}),
  ],
  module: {loaders: [
    {test: /\.js$/, exclude: /node_modules/, loader: 'babel?presets[]=es2015'},
    {test: /\.scss$/, loader: 'style!css!postcss!sass'},
    {test: /\.woff$/, loader: 'file?name=[name].[ext]'}
  ]},
  postcss: [assets(), autoprefixer(), svgo()]
}

if (process.env.NODE_ENV === 'production') {
  config = _.mergeWith(config, {
    plugins: [
      new webpack.DefinePlugin({'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`}),
      new webpack.optimize.UglifyJsPlugin()
    ]
  }, (objValue, srcValue) => _.isArray(objValue) && objValue.concat(srcValue));
} else {
  config = _.merge(config, {
    devtool: 'eval-source-map', devServer: {contentBase: './build'}
  });
}

export {config as default};
