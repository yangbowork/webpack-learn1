const { Tapable, AsyncSeriesHook } = require("tapable");

class Compiler extends Tapable {
  constructor(context) {
    super();
    this.context = context;
    this.hooks = {
      done: new AsyncSeriesHook(["stats"]), // 当编译完成后会触发这个钩子执行
    };
  }
  run(callback) {
    console.log("Compiler run");
    callback(null, {
      toJson: () => ({
        entries: [], // 显示所有的入口
        chunks: [], // 显示所有的代码块
        modules: [], // 显示所有模块
        assets: [] // 显示所有打包后的资源，也就是文件
      }),
    });
  }
}
module.exports = Compiler
