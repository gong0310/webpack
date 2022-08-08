class AnalyzeWebpackPlugin {
  constructor() {}
  apply(compiler) {
    compiler.hooks.emit.tap('AnalyzeWebpackPlugin', (compilation) => {
      // 1. 遍历所有即将输出的文件，得到其大小
      // Object.entries将对象变成二维数组。二维数组中第一项值是key，第二项值是value
      const assets = Object.entries(compilation.assets);

      /**
       * md中表格语法：
       *     | 资源名称 | 资源大小 |
       *     | --- | --- |
       *     | xxx.js | 10kb |
       */
      let content = `| 资源名称 | 资源大小 |
| --- | --- |`;

      assets.forEach(([filename, file]) => {
        content += `\n| ${filename} | ${Math.ceil(file.size() /1024)}kb |`;
      });
      // 2. 生成一个md文件
      compilation.assets['文件名.md'] = {
        source() {
          return content;
        },
        size() {
          return content.length;
        },
      };
    });
  }
}
module.exports = AnalyzeWebpackPlugin;
