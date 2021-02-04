const path = require('path');
// Optimizes duplicates in splitted bundles
const webpack = require('webpack');
// creates index.html file by a template index.ejs
const HtmlWebpackPlugin = require('html-webpack-plugin');
// cleans dist folder
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// copies the assets folder into dist folder
const CopyWebpackPlugin = require('copy-webpack-plugin');
// output folder location
const distFolder = './build';
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.ts',
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/game.html',
      filename: 'game.html'
    }),
    new CopyWebpackPlugin([{ from: 'src/assets', to: 'assets' }]),
    new CopyWebpackPlugin([
      { from: 'src/html/*.html', to: '.', flatten: true }
    ]),
    new VueLoaderPlugin()
  ],
  devtool: 'inline-source-map',
  devServer: {
    contentBase: distFolder,
    host: '0.0.0.0',
    //public: 'zsiri.eu:8080',
    public: 'localhost:8080'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              appendTsSuffixTo: [/\.vue$/]
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.vue'],
    alias: {
      vue$: 'vue/dist/vue.esm.js'
    }
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, distFolder)
  }
};
