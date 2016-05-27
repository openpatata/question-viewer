
import autoprefixer from 'autoprefixer';
import assets from 'postcss-assets';
import svgo from 'postcss-svgo';

import HtmlWebpackPlugin from 'html-webpack-plugin';


export default {
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
