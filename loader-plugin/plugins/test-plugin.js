// 1. webpack读取配置时，new TestPlugin() ，会执行插件 constructor 方法
// 2. webpack创建 compiler 对象
// 3. 遍历plugins中的所有插件，调用插件的 apply 方法
// 4. 执行剩下的编译流程（触发各个hooks事件）
class TestPlugin {
  constructor() {
    console.log("TestPlugin constructor");
  }
  apply(compiler) {
    // debugger;
    console.log("TestPlugin apply");
    /**
     * 参数：插件名称，事件执行的回调函数
     */
    compiler.hooks.entryOption.tap("TestPlugin", (context, entry) => {
      // 由文档可知,entryOption是同步钩子，所以使用tap注册
      console.log("TestPlugin entryOption");
    });

    // 由文档可知，emit是异步串行钩子AsyncSeriesHook，等待上一个触发完执行，再执行下一个

    // tap：可以注册同步钩子和异步钩子
    compiler.hooks.emit.tap("TestPlugin", (compilation) => {
      console.log("TestPlugin emit");
    });
    // tapAsync：回调方式注册异步钩子。
    compiler.hooks.emit.tapAsync("TestPlugin", (compilation, callback) => {
      setTimeout(() => {
        console.log("TestPlugin tapAsync emit");
        callback();
      }, 1000);
    });
    // tapPromise：Promise 方式注册异步钩子
    compiler.hooks.emit.tapPromise("TestPlugin", (compilation) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log("TestPlugin tapPromise emit");
          resolve();
        }, 1000);
      });
    });

    //由文档可知，make是异步并行钩子AsyncParallelHook。同时触发，触发完执行，不等待
    compiler.hooks.make.tapAsync("TestPlugin", (compilation, callback) => {
      // 需要在 compilation hooks 触发前注册才能使用
      compilation.hooks.seal.tap("TestPlugin", () => {
        console.log("TestPlugin compilation seal");
      });
      setTimeout(() => {
        console.log("TestPlugin tapAsync make 111");
        callback();
      }, 3000);
    });
    compiler.hooks.make.tapAsync("TestPlugin", (compilation, callback) => {
      setTimeout(() => {
        console.log("TestPlugin tapAsync make 222");
        callback();
      }, 1000);
    });
    compiler.hooks.make.tapAsync("TestPlugin", (compilation, callback) => {
      setTimeout(() => {
        console.log("TestPlugin tapAsync make 333");
        callback();
      }, 2000);
    });
  }
}

module.exports = TestPlugin;

// 执行webpack指令打包的时候会创建Compiler，把webpack打包的东西全部挂载到Compiler，
// 然后开始运行，这个时候会触发Compiler对象中的一些钩子函数。
// 触发的过程中，在某一个阶段就会创建Compilation对象，代表我要处理资源了，
// 资源的具体处理都是在Compilation中完成的，Compilation对资源进行各种各样的处理，
// 处理完之后，如果是多入口，又会进来Compilation进行处理。所以Compilation可以触发多次。
// 最后将资源输出出去


// 作用：可以扩展 webpack，拥有更强的构建能力，加入自定义的构建行为。

// loader运行在打包文件之前；plugins在整个编译周期都起作用，可以解决loader无法实现的功能 