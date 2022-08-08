// 生产/开发环境配置也可以写在一起，分开只是为了更方便管理。或者直接通过环境变量区分

const path = require("path"); //nodejs核心模块，专门处理路径问题
const webpack = require("webpack");
// const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin"); // 自动为html引入js文件
// const MiniCssExtractPlugin = require("mini-css-extract-plugin"); //将 CSS 提取到单独的文件，就不会通过js创建style而引起闪屏

module.exports = {
  //入口，在main.js中引入的资源都会被编译打包
  entry: "./src/main.js", //相对路径
  //输出
  output: {
    //所有文件输出路径
    // __dirname nodejs变量，代表当前文件的文件夹目录
    path: path.resolve(__dirname, "dist"), //绝对路径
    // 入口文件打包输出文件名
    filename: "static/js/main.js", // 将 js 文件输出到 static/js 目录中
    clean: true, // 自动将上次打包目录资源清空，在webpack4中需要使用插件clean-webpack-plugin
  },
  //加载器
  module: {
    rules: [
      //loader的配置
      {
        test: /\.css$/i, //只检测.css结尾的文件
        // 执行顺序：从右到左（从下到上）
        use: [
          "style-loader", //将js中css通过插件style标签添加到html中生效
          "css-loader", //将css资源编译成commonjs的模块到js中
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
        exclude: /(node_modules|bower_components)/, //排除node_modules和bower_components下的文件不处理
        use: {
          loader: "babel-loader",
          // 可换写在 babel.config.js文件里面，方便管理
          // options: {
          //   presets: ["@babel/preset-env"],
          // },
        },
      },
    ],
  },
  //插件，插件都是构造函数，所以都是new调用。必须引入
  plugins: [
    // plugin的配置

    // new ESLintWebpackPlugin({ // 加入后，如果不规范会报错并中止打包
    //   // 指定检查文件的根目录
    //   context: path.resolve(__dirname, "src"),
    // }),

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
      template: path.resolve(__dirname, "public/index.html"),
    }),
  ],
  // 开发服务器，文件发生变化自动编译。不会输出资源到dist，在内存中编译打包的。npm i webpack-dev-server -D
  // npx webpack serve 启动
  devServer: {
    host: "localhost", // 启动服务器域名
    port: "3000", // 启动服务器端口号
    open: true, // 是否自动打开浏览器
  },
  //模式
  mode: "development",
};
