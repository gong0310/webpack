// 生产环境配置文件
// 优化打包构建速度
      // oneOf
      // babel/eslint缓存
      // 多线程打包
      // externals
      // code split，cacheGroups分开单独打包
      // runtime辅助/公共代码 提取

// 优化代码运行的性能
      // 缓存(hash-chunkhash-contenthash)
      // tree shaking 去无用代码,减少打包体积。前提：production，使用es6模块化。wwebpack5比webpack4更强大，因为webpack4里面文件嵌套引入层级多了，就识别不出来
      // 懒加载/预加载
      // pwa 渐进式网络应用程序


const os = require("os");
const path = require("path"); //nodejs核心模块，专门处理路径问题
const webpack = require("webpack");
// const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin"); // 自动为html引入js文件
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); //替换style-loader，将 CSS 提取到单独的文件，就不会通过js创建style而引起闪屏
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin"); //Css 压缩
// 默认生产模式已经开启了：html 压缩和 js 压缩,不需要额外进行配置

// cpu核数
const threads = os.cpus().length;
// 多进程打包：开启电脑的多个进程同时干一件事，速度更快。
// 需要注意：请仅在特别耗时的操作中使用，因为每个进程启动就有大约为 600ms 左右开销
const TerserPlugin = require("terser-webpack-plugin"); // 内置就有，html压缩和js压缩就是它干的

// const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const PreloadWebpackPlugin = require("@vue/preload-webpack-plugin"); // 提前加载资源
const WorkboxPlugin  = require("workbox-webpack-plugin");

// 封装，获取处理样式的Loaders
const getStyleLoaders = (preProcessor) => {
  return [
    // 执行顺序：从右到左（从下到上）
    // "style-loader", // 将 JS 字符串生成为 style 节点
    MiniCssExtractPlugin.loader, // CSS 提取到单独的文件，而不是style标签
    "css-loader", //将css资源编译成commonjs的模块到js中
    {
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          plugins: [
            "postcss-preset-env", // 能解决大多数样式兼容性问题
          ],
        },
      },
    },
    preProcessor,
  ].filter(Boolean); // 过滤 undefined的值，比如preProcessor不传
};
module.exports = {
  //入口，在main.js中引入的资源都会被编译打包
  // entry: "./src/main.js", //相对路径

  //----------------多入口
  entry: {
    main: "./src/main.js",
    app: "./src/app.js",
  },

  //输出
  output: {
    //所有文件输出路径
    // __dirname nodejs变量，代表当前文件的文件夹目录
    path: path.resolve(__dirname, "../dist"), // 生产模式需要输出
    // 入口文件打包输出文件名
    // filename: "static/js/main.js", // 将 js 文件输出到 static/js 目录中

    // [name]是webpack命名规则，使用chunk的name作为输出的文件名。
    // 什么是chunk？打包的资源就是chunk，输出出去叫bundle。
    // chunk的name是啥呢？ 比如： entry中xxx: "./src/xxx.js", name就是xxx。注意是前面的xxx，和文件名无关。
    // 为什么需要这样命名呢？如果还是之前写法main.js，那么打包生成两个js文件都会叫做main.js会发生覆盖。(实际上会直接报错的)
    // [contenthash:8]使用contenthash，取8位长度
    filename: "static/js/[name].[contenthash:8].js", // webpack命名方式，[name]以文件名自己命名
    chunkFilename: "static/js/[name].[contenthash:8].chunk.js", //给打包输出的其他文件命名。如动态加载的文件,node_modules引入的资源
    assetModuleFilename: "static/media/[name].[hash][ext]", // 图片、字体等通过type: "asset"命名的资源（注意用hash）

    clean: true, // 自动将上次打包目录资源清空，在webpack4中需要使用插件clean-webpack-plugin
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
            use: getStyleLoaders(),
          },
          {
            test: /\.less$/i,
            // 文档是loader，错误的。应该使用use
            // loader:"xxx-loader" //只能使用一个loader
            use: getStyleLoaders("less-loader"),
          },
          {
            test: /\.s[ac]ss$/i,
            use: getStyleLoaders("sass-loader"),
          },
          {
            test: /\.styl$/i,
            use: getStyleLoaders("stylus-loader"),
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
            // generator: {
            //   // 将图片文件输出到 static/imgs 目录中
            //   // 将图片文件命名 [hash:8][ext][query]
            //   // [hash:8]: hash值取8位
            //   // [ext]: 使用之前的文件扩展名
            //   // [query]: 添加之前的query参数
            //   //输出图片名称
            //   filename: "static/images/[hash:8][ext][query]",
            // },
          },
          // type: "asset/resource" 相当于file-loader, 将文件转化成 Webpack 能识别的资源，其他不做处理
          // type: "asset" 相当于url-loader, 将文件转化成 Webpack 能识别的资源，同时小于某个大小的资源会处理成 data URI 形式
          {
            test: /\.(ttf|woff2?)$/, //字体文件
            type: "asset/resource", // resource表示会原封不动的把资源输出
            // generator: {
            //   filename: "static/media/[hash:8][ext][query]",
            // },
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
            // include: path.resolve(__dirname, "../src"), // 只处理src下文件。include、exclude不能同时用，报错
            use: [
              {
                loader: "thread-loader", // 开启多进程
                options: {
                  workers: threads, // 数量
                },
              },
              {
                loader: "babel-loader",
                // 可换写在 babel.config.js文件里面，方便管理
                options: {
                  // presets: ["@babel/preset-env"],
                  cacheDirectory: true, // 开启babel编译缓存
                  cacheCompression: false, // 缓存文件不要压缩
                  plugins: ["@babel/plugin-transform-runtime"], // 减少代码体积
                },
              },
            ],
          },
        ],
      },
    ],
  },
  //插件，插件都是构造函数，所以都是new调用。必须引入
  plugins: [
    // plugin的配置
    // new ESLintWebpackPlugin({ // 加入后，如果不规范会报错并中止打包
    //   // 指定检查文件的根目录
    //   context: path.resolve(__dirname, "../src"),
    //   exclude: "node_modules", //排除node_modules下的文件不处理。默认
    //   cache: true, // 开启缓存
    //   // 缓存目录
    //   cacheLocation: path.resolve(__dirname,"../node_modules/.cache/.eslintcache"),
    //   threads, // 开启多进程
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
      template: path.resolve(__dirname, "../public/index.html"),
    }),
    // CSS 提取到单独的文件
    new MiniCssExtractPlugin({
      filename: "static/css/[name].[contenthash:8].css", //打包到static/css/main.css
      chunkFilename: "static/css/[name].[contenthash:8].chunk.css",
    }),
    // css压缩,css压缩也可以写到optimization.minimizer里面，效果一样的
    // new CssMinimizerPlugin(),

    new PreloadWebpackPlugin({
      rel: "preload", // preload兼容性更好
      as: "script",
      // rel: 'prefetch' // prefetch兼容性更差
      // Preload只能加载当前页面需要使用的资源，Prefetch可以加载当前页面资源，也可以加载下一个页面需要使用的资源。
    }),
    new WorkboxPlugin.GenerateSW({
      // 这些选项帮助快速启用 ServiceWorkers
      // 不允许遗留任何“旧的” ServiceWorkers
      clientsClaim: true,
      skipWaiting: true,
    }),
  ],
  // 插件配置自定义，优化
  optimization: {
    minimize: true,
    // 压缩的操作
    minimizer: [
      new CssMinimizerPlugin(),
      // 当生产模式会默认开启TerserPlugin，但是我们需要进行其他配置，就要重新写了
      new TerserPlugin({
        parallel: threads, // 开启多进程
      }),
      // 压缩图片
      // new ImageMinimizerPlugin({
      //   minimizer: {
      //     implementation: ImageMinimizerPlugin.imageminGenerate,
      //     options: {
      //       plugins: [
      //         ["gifsicle", { interlaced: true }],
      //         ["jpegtran", { progressive: true }],
      //         ["optipng", { optimizationLevel: 5 }],
      //         [
      //           "svgo",
      //           {
      //             plugins: [
      //               "preset-default",
      //               "prefixIds",
      //               {
      //                 name: "sortAttrs",
      //                 params: {
      //                   xmlnsOrder: "alphabetical",
      //                 },
      //               },
      //             ],
      //           },
      //         ],
      //       ],
      //     },
      //   },
      // }),
    ],
    // 代码分割配置
    splitChunks: {
      // 此时我们会发现生成 3 个 js 文件，其中有一个就是提取的公共模块

      chunks: "all", // 对所有模块都进行分割
      // 以下是默认值
      // minSize: 20000, // 分割代码最小的大小，合算20kb
      // minRemainingSize: 0, // 类似于minSize，最后确保提取的文件大小不能为0
      // minChunks: 1, // 至少被引用的次数，满足条件才会代码分割
      // maxAsyncRequests: 30, // 按需加载时并行加载的文件的最大数量
      // maxInitialRequests: 30, // 入口js文件最大并行请求数量
      // enforceSizeThreshold: 50000, // 超过50kb一定会单独打包（此时会忽略minRemainingSize、maxAsyncRequests、maxInitialRequests）
      // cacheGroups: { // 组，哪些模块要打包到一个组
      //   defaultVendors: { // 组名
      //     test: /[\\/]node_modules[\\/]/, // 需要打包到一起的模块
      //     priority: -10, // 权重（越大越高）
      //     reuseExistingChunk: true, // 如果当前 chunk 包含已从主 bundle 中拆分出的模块，则它将被重用，而不是生成新的模块
      //   },
      //   default: { // 其他没有写的配置会使用上面的默认值
      //     minChunks: 2, // 这里的minChunks权重更大
      //     priority: -20,
      //     reuseExistingChunk: true,
      //   },
      // },
      // 修改配置
      cacheGroups: {
        // 组，哪些模块要打包到一个组
        // defaultVendors: { // 组名
        //   test: /[\\/]node_modules[\\/]/, // 需要打包到一起的模块
        //   priority: -10, // 权重（越大越高）
        //   reuseExistingChunk: true, // 如果当前 chunk 包含已从主 bundle 中拆分出的模块，则它将被重用，而不是生成新的模块
        // },
        default: {
          // 如果是单入口，不需要配置
          // 其他没有写的配置会使用上面的默认值
          minSize: 0, // 我们定义的文件体积太小了，所以要改打包的最小文件体积
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
    // 提取runtime文件
    runtimeChunk: {
      name: (entrypoint) => `runtime~${entrypoint.name}`, // runtime文件命名规则
    },
  },
  // 开发服务器，文件发生变化自动编译。不会输出资源到dist，在内存中编译打包的。npm i webpack-dev-server -D
  // npx webpack serve 启动
  // devServer: {
  //   host: "localhost", // 启动服务器域名
  //   port: "3000", // 启动服务器端口号
  //   open: true, // 是否自动打开浏览器
  // },
  //模式
  mode: "production",
  devtool: "source-map", // SourceMap（源代码映射）是一个用来生成源代码与构建后代码一一映射的文件的方案,更加准确的错误提示，来帮助我们更好的开发代码
};
