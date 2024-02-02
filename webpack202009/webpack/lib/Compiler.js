const {
  Tapable,
  SyncHook,
  SyncBailHook,
  AsyncSeriesHook,
  AsyncParallelHook,
} = require("tapable");
const NormalModuleFactory = require("./NormalModuleFactory");
const Compilation = require("./Compilation");
const Stats = require("./Stats");
class Compiler extends Tapable {
  constructor(context) {
    super();
    this.context = context;
    this.hooks = {
      entryOption: new SyncBailHook(["context", "entry"]), // context项目根目录的绝对路径 C:\XXX\Webpack202009；entry入口文件路径 ./src/index.js
      beforeRun: new AsyncSeriesHook(["compiler"]), // 运行前
      run: new AsyncSeriesHook(["compiler"]), // 运行

      beforeCompile: new AsyncSeriesHook(["params"]), // 编译前
      compile: new SyncHook(["params"]), // 编译
      make: new AsyncParallelHook(["compilation"]), // make构建
      thisCompilation: new SyncHook(["compilation", "params"]), // 开始一次新的编译
      compilation: new SyncHook(["compilation", "params"]), // 创建完成一个新的complation
      afterCompile: new AsyncSeriesHook(["compilation"]), // 编译完成

      done: new AsyncSeriesHook(["stats"]), // 当编译完成后会触发这个钩子执行
    };
  }

  // run方法是开始编译的入口
  run(callback) {
    console.log("Compiler run");
    // 这编译完成最终的回调函数
    const finalCallback = (err, stats) => {
      return callback(err, stats);
    };

    const onCompiled = (err, compilation) => {
      return finalCallback(err, new Stats(compilation));
    };

    this.hooks.beforeRun.callAsync(this, (err) => {
      this.hooks.run.callAsync(this, (err) => {
        this.compile(onCompiled);
      });
    });
  }

  newCompilationParams() {
    const params = {
      // 在创建compilation这之前已经创建了一个普通模块工厂
      normalModuleFactory: new NormalModuleFactory(),
    };
    return params;
  }
  createCompilation() {
    return new Compilation(this);
  }
  newCompilation(params) {
    const compilation = this.createCompilation(this);
    this.hooks.thisCompilation.call(compilation, params);
    this.hooks.compilation.call(compilation, params);
    return compilation;
  }

  compile(callback) {
    const params = this.newCompilationParams();

    this.hooks.beforeCompile.callAsync(params, (err) => {
      this.hooks.compile.call(params);
      // 创建一个新compilation对象
      const compilation = this.newCompilation(params);
      // 触发make钩子的回调函数执行
      this.hooks.make.callAsync(compilation, (err) => {
        console.log("make完成");
        callback(err, compilation);
      });
    });
  }
}
module.exports = Compiler;
