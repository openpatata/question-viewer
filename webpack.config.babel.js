
import ld from 'lodash'

import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'

import autoprefixer from 'autoprefixer'
import assets from 'postcss-assets'
import svgo from 'postcss-svgo'


let config = {
  entry: ['whatwg-fetch', './src/index'],
  output: {path: './question-viewer', filename: 'bundle.[hash].js'},
  plugins: [
    new HtmlWebpackPlugin({template: './src/index.html'})
  ],
  module: {loaders: [
    {test: /\.js$/, exclude: /node_modules/, loader: 'babel?presets[]=es2015'},
    {test: /\.json$/, loader: 'file?name=[name].[hash].[ext]'},
    {test: /\.scss$/, loader: 'style!css!postcss!sass'}
  ]},
  postcss: [assets(), autoprefixer(), svgo()]
}

if (process.env.NODE_ENV === 'production') {
  config = ld.mergeWith(config, {
    plugins: [
      new webpack.DefinePlugin({'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`}),
      new webpack.optimize.UglifyJsPlugin()
    ]
  }, (objValue, srcValue) => ld.isArray(objValue) && objValue.concat(srcValue))
} else {
  config = ld.merge(config, {
    devtool: 'eval-source-map', devServer: {contentBase: './build'}
  })
}

export {config as default}
