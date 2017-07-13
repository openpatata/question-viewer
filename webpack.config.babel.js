
import ld from 'lodash'

import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'


let config = {
  entry: ['whatwg-fetch', './src/index'],
  output: {path: `${__dirname}/question-viewer`, filename: 'bundle.[hash].js'},
  plugins: [
    new HtmlWebpackPlugin({template: './src/index.html'})
  ],
  module: {rules: [
    {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader?presets[]=es2015'},
    {test: /\.json$/, loader: 'file-loader?name=[name].[hash].[ext]'},
    {test: /\.scss$/, loader: 'style-loader!css-loader!postcss-loader!sass-loader'},
    {test: /CNAME$/, loader: 'file-loader?name=[name]'}
  ]},
  resolve: {alias: {
    forerunnerdb: `${__dirname}/node_modules/forerunnerdb/js/builds/all.js`
  }}
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
    devtool: 'eval-source-map', devServer: {contentBase: `${__dirname}/build`}
  })
}

export {config as default}
