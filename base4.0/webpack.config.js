const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const WorkboxPlugin = require("workbox-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const testPlugin = require('./pulgin/test-plugin');
const os = require("os");
// cpu核数
const threads = os.cpus().length;
const isProduction = process.env.NODE_ENV === "production";
/**
 * hash: 每次webpack构建时生成一个唯一hash值。会导致缓存生效
 * chunkhash：根据chunk生成的hash值，如果多个文件打包来源于同一个入口(也就是同属于一个chunk)，共享同一个hash值。chunk变了，就重新生成hash
 * contenthash：根据文件的内容生成hash值。不同文件hash值一定不一样。哪个文件内容变了，哪个文件就重新生成hash
 */
module.exports = {
  // entry：array object string
  // entry: {
  //   index: ["./src/main.js", "./src/main2.js"], //输出一个
  //   index2: "./src/index2.js", //输出一个
  // },
  // entry: ["./src/main.js","./src/main2.js"], 输出一个
  entry: "./src/main.js", //输出一个
  output: {
    path: path.resolve(__dirname, "dist"), // 文件输出目录
    // 文件输出名
    filename: isProduction
      ? "static/js/[name].[contenthash:8].js"
      : "static/js/[name].js",
    chunkFilename: "static/js/[name].chunk.js", // 非入口的chunk
    clean: true,
    // 所有资源引入公共路径的前缀
    // publicPath: 'https://cdn.example.com/assets/'
    library: "[name]", // 整个库向外暴露的变量名
    libraryTarget: "window", // 变量名添加到哪个属性上
  },
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.css$/,
            use: [
              // 插件style标签，将样式放入
              // "style-loader",
              // 取代style-loader，提取js中的css成单独文件
              MiniCssExtractPlugin.loader,
              // 将css文件整合到js文件中
              "css-loader",
              {
                loader: "postcss-loader",
                options: {
                  postcssOptions: {
                    plugins: [
                      [
                        "postcss-preset-env",
                        {
                          // 其他选项
                        },
                      ],
                    ],
                  },
                },
              },
            ],
          },
          {
            test: /\.less$/,
            use: [
              //   "style-loader",
              MiniCssExtractPlugin.loader,
              "css-loader",
              {
                loader: "postcss-loader",
                options: {
                  postcssOptions: {
                    plugins: [
                      [
                        "postcss-preset-env",
                        {
                          // 其他选项
                        },
                      ],
                    ],
                  },
                },
              },
              "less-loader",
            ],
          },
          {
            test: /\.(jpe?g|png|gif)$/,
            // type: "asset",
            // parser: {
            //   dataUrlCondition: {
            //     maxSize: 10 * 1024 // 小于10kb的图片会被base64处理
            //   }
            // }
            loader: "url-loader", // url-loader依赖于file-loader，所以两个都下
            options: {
              limit: 8 * 1024,
              esModule: false, // 关闭url-loader的es6模块化，使用commonjs解析
              name: "static/[hash:8].[ext]",
            },
            type: "javascript/auto",
            // webpack版本是5以上，url-loader、file-loader已经弃用，
            // 如果想继续使用在use后面添加type: 'javascript/auto'
          },
          {
            test: /\.js$/,
            include: path.resolve(__dirname, "./src"), // 也可以用包含
            // enforce:'pre', 优先执行
            use: [
              {
                loader: "./loader/test.loader.js",
                options: {
                  author: '哈哈哈',
                },
              },
              {
                loader: "thread-loader", // 开启多进程
                options: {
                  workers: threads, // 数量
                },
              },
              {
                loader: "babel-loader",
                options: {
                  cacheDirectory: true,
                  cacheCompression: false,
                  presets: [
                    [
                      "@babel/preset-env", // 只能处理基本es6语法，处理不了promise 等，要用core-js
                      // 按需加载core-js的polyfill
                      {
                        useBuiltIns: "usage",
                        corejs: { version: "3", proposals: true },
                      },
                    ],
                  ],
                  plugins: ["@babel/plugin-transform-runtime"],
                },
              },
            ],
          },
          // {
          //   test: /\.html$/,
          //   // 处理html文件的img图片
          //   loader: "html-loader",
          // },
          // {
          //   // 处理其他资源
          //   // 排除哪些资源
          //   exclude: /\.(css|js|html|json|less|jpe?g|png|gif|bin)$/,
          //   loader: "file-loader",
          //   options: {
          //     name: "static/[hash:8].[ext]",
          //   },
          // },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "template",
      template: path.resolve(__dirname, "./public/index.html"),
    }),
    new MiniCssExtractPlugin({
      filename: "static/[name].css",
      // filename: "static/[name].[contenthash:8].css",
      chunkFilename: "static/css/[name].[contenthash:10].chunk.css",
    }),
    new ESLintPlugin({
      // 指定检查文件的根目录
      context: path.resolve(__dirname, "src"),
      cache: true, // 开启缓存
      // 缓存目录
      cacheLocation: path.resolve(
        __dirname,
        "./node_modules/.cache/.eslintcache"
      ),
      fix: true,
    }),
    new WorkboxPlugin.GenerateSW({
      // 这些选项帮助快速启用 ServiceWorkers
      // 不允许遗留任何“旧的” ServiceWorkers
      clientsClaim: true,
      skipWaiting: true,
    }),
    // 将public下面的资源复制到dist目录去（除了index.html）
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "./public"),
          to: path.resolve(__dirname, "./dist"),
          toType: "dir",
          noErrorOnMissing: true, // 不生成错误
          globOptions: {
            // 忽略文件
            ignore: ["**/index.html"],
          },
          info: {
            // 跳过terser压缩js
            minimized: true,
          },
        },
      ],
    }),
    new testPlugin({
      test:'哈哈哈'
    })
  ],
  optimization: {
    minimize: true,
    minimizer: [
      // 配置生产环境的压缩方案: js css
      new CssMinimizerPlugin(),
      new TerserWebpackPlugin({
        parallel: true, // 开启多进程打包
        // sourceMap: true, // 启动source-map，不然会被压缩掉。webpack5已改
      }),
    ],
    splitChunks: {
      chunks: "all",
      // miniSize: 30 * 1024, // 分割的chuank最小为30kb
      // maxiSiza: 0, // 最大没有限制
      // minChunks: 1, // 至少被引用的次数，满足条件才会代码分割
      // maxAsyncRequests: 5, // 按需加载时并行加载的文件的最大数量
      // maxInitialRequests: 5, // 入口js文件最大并行请求数量
      // automaticNameDelimiter: "~", // 名称连接符
      // name: true, // 可以使用命名规则
      cacheGroups: {
        //分割chunk的组
        vendors: {
          // node_modules文件会被打包到vendors组的chunk文件中
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
        },
      },
    },
    // 提取runtime文件，将当前模块记录其他模块的hash值单独打包成一个文件
    // 解决：b文件中引入了a文件。修改a文件导致b文件contenthash变化
    runtimeChunk: {
      name: (entrypoint) => `runtime~${entrypoint.name}`, // runtime文件命名规则
    },
  },
  //解析模块的规则
  resolve: {
    // 配置解析模块路径别名
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    // 配置省略文件路径的后缀名，默认有.js .json，所以在引入的时候可以省略
    extensions: [".js", ".json"],
    // 告诉weboack 解析模块去找哪个目录
    modules: [path.resolve(__dirname, "./node_modules"), "node_modules"],
  },
  mode: isProduction ? "production" : "development",
  // 可以直接用webpack-cdn-plugin
  // externals:{
  //   // 忽略库名 -- npm包名
  //   jquery:'jQuery'
  // },
  devtool: isProduction ? "source-map" : "eval-source-map",
  /**
   * source-map: 一种提供源代码到构建后代码映射的技术（如果构建后代码出错了，通过映射可以追踪源代码错在哪）
   * [inline-|hidden-eval-] [nosources-] [cheap-[module-]] source-map
   *
   * source-map: 外部
   *      错误代码准确信息 和 源代码的错误位置
   *
   * inline-source-map：内联, 映射代码在通过编译成base64的方式存储在当前js文件中，而不是生成单独的map文件
   *       只生成一个source-map
   *       错误代码准确信息 和 源代码的错误位置
   *
   * hidden-source-map：外部
   *       不能追踪到源代码的错误位置，只能提示到构建后代码的错误位置，隐藏源代码
   *
   * eval-source-map：内联
   *       每个文件都生成生成一个source-map，都在eval中
   *
   * nosources-source-map：外部
   *      错误代码准确信息，但没有任何源代码信息，源代码/构建后代码全部隐藏
   * cheap-source-map：外部
   *      定位错误信息精确到 行，没有列
   * cheap-module-source-map：外部
   *      module会将loader的source map加进来
   *
   *
   * 开发环境：速度块，调试友好
   *      速度块(eval>inline>cheap)
   *      eval-cheap-source-map > eval-source-map
   *      调试友好
   *      source-map > cheap-module-source-map > cheap-source-map
   * 生产环境：源码隐藏
   *  一般不用内联，会让代码体积变大
   */
  devServer: {
    host: "localhost", // 域名
    port: 8000, // 端口号
    hot: true, // 开启HMR功能，style-loader默认使用了css热模块更新
    // open: true,
    // clientLogLevel: 'none', // 不需要显示启动服务器的日志
    // overlay: { // 当出现编译错误或警告时，在浏览器中显示全屏覆盖层
    //   warnings: true,
    //   errors: true
    // }
    // 服务器代理，解决开发环境跨域问题
    proxy: {
      "/api": {
        target: "http://localhost:3000/",
        pathRewrite: {
          // 路径重写
          "^/api": "",
        },
      },
    },
  },
};
