const path = require("path");
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // 替换style-loader，将 CSS 提取到单独的文件，就不会通过js创建style而引起闪屏
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin"); //Css 压缩
const TerserWebpackPlugin = require("terser-webpack-plugin"); // js 压缩
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin"); // 图片压缩
// npm i -D copy-webpack-plugin@9.*
const CopyPlugin = require("copy-webpack-plugin"); // 将public下的文件原封不动的复制到dist目录下，如icon、公共css
const { VueLoaderPlugin } = require("vue-loader");
const { DefinePlugin } = require("webpack");

// element-plus按需导入
const AutoImport = require("unplugin-auto-import/webpack");
const Components = require("unplugin-vue-components/webpack");
const { ElementPlusResolver } = require("unplugin-vue-components/resolvers");

// 生产模式，不需要HMR功能

// 需要通过 cross-env 定义环境变量
const isProduction = process.env.NODE_ENV === "production";

// 封装，获取处理样式的Loaders
const getStyleLoaders = (preProcessor) => {
  return [
    // 执行顺序：从右到左（从下到上）
    isProduction ? MiniCssExtractPlugin.loader : "vue-style-loader", // CSS 提取到单独的文件，而不是style标签
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
    preProcessor && {
      loader: preProcessor,
      options:
        preProcessor === "sass-loader"
          ? {
              // 自定义主题：自动引入我们定义的scss文件
              additionalData: `@use "@/styles/element/index.scss" as *;`,
            }
          : {},
    },
  ].filter(Boolean); // 过滤 undefined的值，比如preProcessor不传
};

module.exports = {
  entry: "./src/main.js",
  output: {
    path: isProduction ? path.resolve(__dirname, "../dist") : undefined,
    filename: isProduction
      ? "static/js/[name].[contenthash:10].js"
      : "static/js/[name].js",
    chunkFilename: isProduction
      ? "static/js/[name].[contenthash:10].chunk.js"
      : "static/js/[name].chunk.js",
    assetModuleFilename: "static/media/[hash:10][ext][query]",
    clean: true, // 自动将上次打包目录资源清空，在webpack4中需要使用插件clean-webpack-plugin
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
      {
        test: /\.(t|j|mj)s$/,
        include: path.resolve(__dirname, "../node_modules/element-plus"),
        resolve: {
          fullySpecified: false,
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
    isProduction &&
      new MiniCssExtractPlugin({
        filename: "static/css/[name].[contenthash:10].css",
        chunkFilename: "static/css/[name].[contenthash:10].chunk.css",
      }),
    // 将public下面的资源复制到dist目录去（除了index.html）
    isProduction &&
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, "../public"),
            to: path.resolve(__dirname, "../dist"),
            globOptions: {
              // 忽略文件
              ignore: ["**/index.html"],
            },
          },
        ],
      }),
    new VueLoaderPlugin(),
    new DefinePlugin({
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
    }),
    // element-plus按需导入
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [
        ElementPlusResolver({
          // 自定义主题 引入sass
          importStyle: "sass",
        }),
      ],
    }),
  ].filter(Boolean),
  optimization: {
    // 代码分割配置
    splitChunks: {
      chunks: "all", // 对所有模块都进行分割
      cacheGroups: {
        // 组，哪些模块要打包到一个组
        // vue 一起打包成一个js文件
        vue: {
          // 组名,自定义
          test: /[\\/]node_modules[\\/]vue(.*)?[\\/]/, // 需要打包到一起的模块
          name: "chunk-vue",
          chunks: "initial",
          priority: 30, // 权重（越大越高）
        },
        // elementUI单独打包
        elementUI: {
          name: "chunk-elementPlus",
          test: /[\\/]node_modules[\\/]_?element-plus(.*)/,
          priority: 30,
        },
        // 剩下的node_modules 单独打包
        libs: {
          test: /[\\/]node_modules[\\/]/, // 需要打包到一起的模块
          name: "chunk-libs",
          priority: 10, // 权重最低，优先考虑前面内容
        },
      },
    },
    // 提取runtime文件，将辅助代码作为一个独立模块，来避免重复打包引入
    runtimeChunk: {
      name: (entrypoint) => `runtime~${entrypoint.name}`, // runtime文件命名规则
    },
    minimize: isProduction,
    // 压缩的操作
    minimizer: [
      new CssMinimizerPlugin(), // css 压缩
      new TerserWebpackPlugin(), // js 压缩
      new ImageMinimizerPlugin({
        // 压缩图片
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminGenerate,
          options: {
            plugins: [
              ["gifsicle", { interlaced: true }],
              ["jpegtran", { progressive: true }],
              ["optipng", { optimizationLevel: 5 }],
              [
                "svgo",
                {
                  plugins: [
                    "preset-default",
                    "prefixIds",
                    {
                      name: "sortAttrs",
                      params: {
                        xmlnsOrder: "alphabetical",
                      },
                    },
                  ],
                },
              ],
            ],
          },
        },
      }),
    ],
  },
  mode: isProduction ? "production" : "development", // production自动会 html 压缩
  devtool: isProduction ? "source-map" : "cheap-module-source-map", // 代码映射
  // webpack解析模块的时候加载的选项,import
   // 解析模块的规则
  resolve: {
     // 配置省略文件路径的后缀名，默认有.js .json，所以在引入的时候可以省略
    extensions: [".vue", ".js", ".json"], // 自动补全文件扩展名，让vue可以使用
    // 路径别名
    alias: {
      "@": path.resolve(__dirname, "../src"),
    },
  },
  devServer: {
    host: "localhost", // 启动服务器域名
    port: "3000", // 启动服务器端口号
    open: true, // 是否自动打开浏览器
    hot: true, // 开启HMR(热模块替换)
    historyApiFallback: true, // 解决vue-router刷新404问题
  },
  performance: false, // 关闭性能分析，提升打包速度
};
