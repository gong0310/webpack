class testPlugin {
  constructor(options = {}) {
    this.options = options;
    console.log("testPlugin constructor", options);
  }
  apply(compiler) {
    // 获取操作文件的对象
    // const fs = compiler.outputFileSystem;
    //获取webpack的全部配置 compiler.options
    console.log("testPlugin compiler");
    compiler.hooks.emit.tap("testPlugin", function (compilation) {
      console.log("testPlugin compilation");
      //   const asset = compilation.asset;
      // 覆盖资源
      //   compilation.assets[assetPath||"analyze.md"] = {
      //     // 资源内容
      //     source() {
      //       return source;
      //     },
      //     // 资源大小
      //     size() {
      //       return source.length;
      //     },
      //   };
    });
  }
}
module.exports = testPlugin;
