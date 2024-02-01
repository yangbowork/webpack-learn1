const { SyncHook } = require("tapable");

class Compiler {
  constructor(options) {
    this.options = options;
    this.hooks = {
      run: new SyncHook(), // 会在开始编译的时候触发
      done: new SyncHook(), // 会在完成编译的时候触发
    };
  }
  run() {
    this.hooks.run.call(); // 当调用run方法的时候会触发run这个钩子，进而执行它的回调函数
    // 中间就是编译过程...
    this.hooks.done.call();
  }
}

module.exports = Compiler;
