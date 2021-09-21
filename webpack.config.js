const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const postcssOptions = require('./postcss.config');

module.exports = () => ({
  devtool: process.env.NODE_ENV === 'development' && 'inline-source-map',

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: { postcssOptions },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|woff2|glb|gltf)$/,
        use: 'url-loader',
      },
    ],
  },
  entry: {
    index: './src/plugin/index.js',
    figma: './src/plugin/figma.js',
  },
  resolve: {
    extensions: ['.js'],
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
  },
  output: {
    publicPath: '/',
    filename: '[name].js',
    path: path.resolve(__dirname, 'build-plugin'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      inlineSource: '.(js)$',
      inject: 'body',
      chunks: ['index'],
      cache: false,
    }),
    new HtmlWebpackInlineSourcePlugin(HtmlWebpackPlugin),
  ],
});
