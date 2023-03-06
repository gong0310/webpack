// 开发环境配置文件
// 优化打包构建速度
// HMR
// 优化代码调试
// source-map
const path = require("path"); //nodejs核心模块，专门处理路径问题
const webpack = require("webpack");
// const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { loader } = require("mini-css-extract-plugin");

module.exports = {
  // 入口，在main.js中引入的资源都会被编译打包
  // entry: "./src/main.js", //相对路径,相对运行代码的目录。单入口

  //----------------多入口
  entry: {
    main: "./src/main.js",
    app: "./src/app.js",
  },
  //输出
  output: {
    //所有文件输出路径
    // 开发模式没有输出，所以可以不需要path
    path: undefined, // 绝对路径

    // 入口文件打包输出文件名
    // filename: "static/js/main.js", // 将 js 文件输出到 static/js 目录中

    // 多入口
    filename: "static/js/[name].js", // webpack命名方式，[name]以文件名自己命名
  },
  //加载器
  module: {
    rules: [
      //loader的配置
      {
        // 打包时每个文件都会经过所有 loader 处理，虽然因为 test 正则原因实际没有处理上，但是都要过一遍。比较慢
        // oneOf: 每个文件只能被其中一个loader配置处理
        oneOf: [
          {
            test: /\.css$/i, //只检测.css结尾的文件
            // 执行顺序：从右到左（从下到上）
            use: [
              "style-loader", //将js中css通过插件style标签添加到html中生效
              "css-loader", //将css资源编译成commonjs的模块到js中
              // css-loader 会对 @import 和 url() 进行处理，就像 js 解析 import/require() 一样。
            ],
          },
          {
            test: /\.less$/i,
            // 文档是loader，错误的。应该使用use
            // loader:"xxx-loader" //只能使用一个loader
            use: [
              //使用多个loader
              "style-loader",
              "css-loader",
              "sass-loader",
            ],
          },
          {
            test: /\.s[ac]ss$/i,
            use: [
              // 将 JS 字符串生成为 style 节点
              "style-loader",
              // 将 CSS 转化成 CommonJS 模块
              "css-loader",
              // 将 Sass 编译成 CSS
              "sass-loader",
            ],
          },
          {
            test: /\.styl$/i,
            use: ["style-loader", "css-loader", "stylus-loader"],
          },
          {
            //过去在 Webpack4 时，我们处理图片资源通过 file-loader 和 url-loader 进行处理
            //现在 Webpack5 已经将两个 Loader 功能内置到 Webpack 里了，我们只需要简单配置即可处理图片资源
            test: /\.(png|jpe?g|gif|webp)$/,
            type: "asset",
            parser: {
              dataUrlCondition: {
                //小图片转base64减少图片请求数量，缺点：体积变大一点点
                maxSize: 10 * 1024, // 10kb
              },
            },
            generator: {
              // 将图片文件输出到 static/imgs 目录中
              // 将图片文件命名 [hash:8][ext][query]
              // [hash:8]: hash值取8位
              // [ext]: 使用之前的文件扩展名
              // [query]: 添加之前的query参数
              //输出图片名称
              filename: "static/images/[hash:8][ext][query]",
            },
          },
          // type: "asset/resource" 相当于file-loader, 将文件转化成 Webpack 能识别的资源，其他不做处理
          // type: "asset" 相当于url-loader, 将文件转化成 Webpack 能识别的资源，同时小于某个大小的资源会处理成 data URI 形式
          {
            test: /\.(ttf|woff2?)$/, //字体文件
            type: "asset/resource", // resource表示会原封不动的把资源输出
            generator: {
              filename: "static/media/[hash:8][ext][query]",
            },
          },
          // {
          //   //处理其他资源,开发中可能还存在一些其他资源，如音视频等
          //   test: /\.(ttf|woff2?|map4|map3|avi)$/,
          //   type: "asset/resource", // resource表示会原封不动的把资源输出
          //   generator: {
          //     filename: "static/media/[hash:8][ext][query]",
          //   },
          // },
          {
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/, //排除node_modules(这些文件是不需要编译可以直接使用的)和bower_components下的文件不处理
            // include: path.resolve(__dirname, "../src"), // 只处理src下文件。include、exclude不能同时用，报错
            use: {
              loader: "babel-loader",
              options: {
                // presets: ["@babel/preset-env"], // 可换写在 babel.config.js文件里面，方便管理
                cacheDirectory: true, // 开启babel编译缓存
                cacheCompression: false, // 缓存文件不要压缩
                plugins: ["@babel/plugin-transform-runtime"], // 减少代码体积
              },
            },
          },
        ],
      },
    ],
  },
  //插件，插件都是构造函数，所以都是new调用。必须引入
  plugins: [
    // plugin的配置
    // webpack4是 eslint-loader
    // new ESLintWebpackPlugin({ // 加入后，如果不规范会报错并中止打包
    //   // 指定检查文件的根目录
    //   context: path.resolve(__dirname, "../src"),
    //   exclude: "node_modules", //排除node_modules下的文件不处理。默认，这些文件是不需要编译可以直接使用的
    //   cache: true, // 开启缓存
    //   // 缓存目录
    //   cacheLocation: path.resolve(__dirname,"../node_modules/.cache/.eslintcache"),
    // }),

    // 每次打包时 js 文件都要经过 Eslint 检查 和 Babel 编译，速度比较慢。
    // 我们可以缓存之前的 Eslint 检查 和 Babel 编译结果，这样第二次打包时速度就会更快了

    new webpack.ProgressPlugin({
      //webpack内置打包进度插件
      activeModules: false,
      entries: true,
      handler(percentage, message, ...args) {
        console.info(Number((percentage * 100).toFixed(2)), message, ...args);
      },
      modules: true,
      modulesCount: 5000,
      profile: false,
      dependencies: true,
      dependenciesCount: 10000,
      percentBy: null,
    }),

    new HtmlWebpackPlugin({
      // filename: 'test.html', //输出文件名。不写就是原文件名

      // 以 public/index.html 为模板创建文件
      // 新的html文件有两个特点：1. 内容和源文件一致 2. 自动引入打包生成的js等资源
      template: path.resolve(__dirname, "../public/index.html"),
    }),
  ],
  // 开发服务器，文件发生变化自动编译。不会输出资源到dist，在内存中编译打包的。npm i webpack-dev-server -D
  // npx webpack serve 启动
  devServer: {
    host: "localhost", // 启动服务器域名
    port: "3000", // 启动服务器端口号
    open: true, // 是否自动打开浏览器
    // style-loader默认使用了css热模块更新，js需要手动写
    hot: true, //(默认开启) 开启HMR(热模块替换)功能（只能用于开发环境，生产环境不需要了）(不开启就是全部更新，类似刷新页面)
  },
  //模式
  mode: "development",
  devtool: "cheap-module-source-map",
};
