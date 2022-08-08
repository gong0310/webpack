const path = require("path");
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");
const { DefinePlugin } = require("webpack");

// 封装，获取处理样式的Loaders
const getStyleLoaders = (preProcessor) => {
  return [
    // 执行顺序：从右到左（从下到上）
    "vue-style-loader", // 它会应用到普通的 `.css` 文件以及 `.vue` 文件中的 `<style>` 块。自带css HMR
    // MiniCssExtractPlugin.loader, // CSS 提取到单独的文件，而不是style标签
    "css-loader", //将css资源编译成commonjs的模块到js中
    {
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          plugins: [
            // 配合在package.json，里面写上browserslist，指定兼容到那个浏览器
            "postcss-preset-env", // 能解决大多数样式兼容性问题
          ],
        },
      },
    },
    preProcessor,
  ].filter(Boolean); // 过滤 undefined的值，比如preProcessor不传
};

module.exports = {
  entry: "./src/main.js",
  output: {
    path: undefined,
    filename: "static/js/[name].js",
    chunkFilename: "static/js/[name].chunk.js",
    assetModuleFilename: "static/media/[hash:10][ext][query]",
  },
  module: {
    rules: [
      // 处理css
      {
        test: /\.css$/,
        use: getStyleLoaders(),
      },
      {
        test: /\.less$/,
        use: getStyleLoaders("less-loader"),
      },
      {
        test: /\.s[ac]ss$/,
        use: getStyleLoaders("sass-loader"),
      },
      {
        test: /\.styl$/,
        use: getStyleLoaders("stylus-loader"),
      },
      // 处理图片
      {
        test: /\.(png|jpe?g|gif|svg|webp)$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb的图片会被base64处理
          },
        },
      },
      // 处理其他资源
      {
        test: /\.(ttf|woff2?|map4|map3|avi)$/,
        type: "asset/resource", // resource表示会原封不动的把资源输出
      },
      // 处理js
      {
        test: /\.js$/,
        include: path.resolve(__dirname, "../src"),
        loader: "babel-loader",
        options: {
          cacheDirectory: true, // 开启babel编译缓存
          cacheCompression: false, // 缓存文件不要压缩
        },
      },
      // 处理vue
      // vue-loader不支持oneOf
      {
        test: /\.vue$/,
        loader: "vue-loader", // 内部会给vue文件注入HMR功能代码,自带HMR
        options: {
          // 开启缓存
          cacheDirectory: path.resolve(
            __dirname,
            "node_modules/.cache/vue-loader"
          ),
        },
      },
    ],
  },
  plugins: [
    new ESLintWebpackPlugin({
      context: path.resolve(__dirname, "../src"), // 指定检查文件的根目录
      exclude: "node_modules", // 排除node_modules下的文件不处理
      cache: true, // 开启缓存
      cacheLocation: path.resolve(
        __dirname,
        "../node_modules/.cache/.eslintcache"
      ), // 缓存目录
    }),
    // 处理html
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../public/index.html"),
    }),
    new VueLoaderPlugin(),
    // 解决页面警告，cross-env 定义的环境变量给打包工具webpack使用，DefinePlugin定义的环境变量是给源代码使用的
    new DefinePlugin({
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
    }),
  ],
  optimization: {
    // 代码分割配置
    splitChunks: {
      chunks: "all", // 对所有模块都进行分割
    },
    // 提取runtime文件，将辅助代码作为一个独立模块，来避免重复打包引入
    runtimeChunk: {
      name: (entrypoint) => `runtime~${entrypoint.name}`, // runtime文件命名规则
    },
  },
  mode: "development",
  devtool: "cheap-module-source-map", // 代码映射
  // 解析模块的规则
  resolve: {
     // 配置省略文件路径的后缀名，默认有.js .json，所以在引入的时候可以省略
    extensions: [".vue", ".js", ".json"], // 自动补全文件扩展名，让vue可以使用
  },
  devServer: {
    host: "localhost", // 启动服务器域名
    port: "3000", // 启动服务器端口号
    open: true, // 是否自动打开浏览器
    hot: true, // 开启HMR(热模块替换)
    historyApiFallback: true, // 解决vue-router刷新404问题
  },
};
