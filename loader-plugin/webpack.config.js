const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TestPlugin = require('./plugins/test-plugin');
const BannerWebpackPlugin = require('./plugins/banner-webpack-plugin');
const CleanWebpackPlugin = require('./plugins/clean-webpack-plugin');
const AnalyzeWebpackPlugin = require('./plugins/analyze-webpack-plugin');
const InlineRuntimeWebpackPlugin = require('./plugins/Inline-runtime-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, 'src/main.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].js',
    // clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['./loaders/style-loader/index.js', 'css-loader'],
      },
      // {
      //   test: /\.js$/,
      //   loader: "./loaders/test-loader.js",
      // },
      // {
      //   test: /\.js$/,
      //   loader: "./loaders/demo/test1-loader.js",
      // },
      // {
      //   test: /\.js$/,
      //   loader: "./loaders/demo/test2-loader.js",
      // },
      // ===简写====
      // {
      //   test: /\.js$/,
      //   use: [
      //     "./loaders/test-loader.js",
      //     "./loaders/demo/test1-loader.js",
      //     "./loaders/demo/test2-loader.js",
      //     "./loaders/demo/test3-loader.js",
      //     "./loaders/demo/test4-loader.js",
      //     "./loaders/demo/test4-1-loader.js",
      //     "./loaders/demo/test4-2-loader.js",
      //     // "./loaders/clean-log-loader.js",
      //     {
      //       loader: "./loaders/banner-loader/index.js",
      //       options: {
      //         author: "张三",
      //       },
      //     },
      //     {
      //       loader: "./loaders/babel-loader/index.js",
      //       options: {
      //         presets: ["@babel/preset-env"],
      //       },
      //     },
      //   ],
      // },
      // 由下往上执行(由右往左)
      {
        test: /\.(png|jpe?g|gif)$/,
        loader: './loaders/file-loader/index.js',
        type: 'javascript/auto', // 解决图片重复打包问题，阻止webpack默认处理图片，只使用file-loader处理
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/index.html'),
    }),
    new TestPlugin(),
    new BannerWebpackPlugin({
      author: '小明',
    }),
    new CleanWebpackPlugin(),
    new AnalyzeWebpackPlugin(),
    new InlineRuntimeWebpackPlugin([/runtime(.*)\.js$/g]),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
    runtimeChunk: {
      name: (entrypoint) => `runtime~${entrypoint.name}`,
    },
  },
  mode: 'production',
  devtool: 'cheap-module-source-map',
  devServer: {
    host: 'localhost',
    port: 3000,
    hot: true,
    open: true,
  },
};
