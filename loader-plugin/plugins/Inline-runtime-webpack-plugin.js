const HtmlWebpackPlugin = require('safe-require')('html-webpack-plugin');

class InlineRuntimeWebpackPlugin {
  constructor(tests = []) {
    this.tests = tests;
  }
  apply(compiler) {
    compiler.hooks.compilation.tap(
      'InlineRuntimeWebpackPlugin',
      (compilation) => {
        // 1. 获取html-webpack-plugin的hooks
        const hooks = HtmlWebpackPlugin.getHooks(compilation);
        // 2. 注册html-webpack-plugin的hooks -> alterAssetTagGroups
        // 3. 从里面将script的runtime文件。变成inline sctipt

        hooks.alterAssetTagGroups.tap('InlineChunkWebpackPlugin', (assets) => {
          assets.headTags = this.getInlineChunk(
            assets.headTags,
            compilation.assets
          );
          assets.bodyTags = this.getInlineChunk(
            assets.bodyTags,
            compilation.assets
          );
        });
        // 删除runtime 文件
        hooks.afterEmit.tap('InlineChunkWebpackPlugin', () => {
          Object.keys(compilation.assets).forEach((assetName) => {
            if (this.tests.some((test) => test.test(assetName))) {
              delete compilation.assets[assetName];
            }
          });
        });
      }
    );
  }
  getInlineChunk(tags, assets) {
    /**
        目前： [
             {
               tagName: 'script',
               voidTag: false,
               meta: { plugin: 'html-webpack-plugin' },
               attributes: { defer: true, type: undefined, src: 'js/runtime~main.js' }
             },
           ]
           修改为： [
             {
               tagName: 'script',
               innerHtml:runtime文件的内容
               closeTag: true
             },
           ]
    */
    return tags.map((tag) => {
      if (tag.tagName !== 'script') return tag;

      const scriptName = tag.attributes.src;

      if (!this.tests.some((test) => test.test(scriptName))) return tag;

      return {
        tagName: 'script',
        innerHTML: assets[scriptName].source(),
        closeTag: true,
      };
    });
  }
}
module.exports = InlineRuntimeWebpackPlugin;
