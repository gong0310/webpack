class BannerWebpackPlugin {
  constructor(options = {}) {
    this.options = options;
  }
  apply(compiler) {
    // 输出 asset 到 output 目录之前执行
    compiler.hooks.emit.tapAsync(
      'BannerWebpackPlugin',
      (compilation, callback) => {
        // 1. 获取即将输出的文件资源，compilation.assets
        const extensions = ['css', 'js'];
        // 2. 过滤只保留js和css资源
        const assets = Object.keys(compilation.assets).filter((assetspath) => {
          // 将文件名切割，获取最后一个文件扩展名
          const splitted = assetspath.split('.');
          const extension = splitted[splitted.length - 1];
          return extensions.includes(extension);
        });
        const prefix = `
      /*
      * Author: ${this.options.author}
      */
    `;
        // 3. 遍历剩下资源添加上注释
        assets.forEach((asset) => {
          // 获取原来内容
          const source = compilation.assets[asset].source();

          // 拼接上注释
          const content = prefix + source;

          // 修改资源
          compilation.assets[asset] = {
            // 最终资源输出时，调用source方法，source方法的返回值就是资源的具体内容
            source() {
              return content;
            },
            // 资源大小
            size() {
              return content.length;
            },
          };
        });
        callback();
      }
    );
  }
}
module.exports = BannerWebpackPlugin;
