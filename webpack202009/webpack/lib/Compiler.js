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
const mkdirp = require("mkdirp");
const path = require("path");

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
      emit: new AsyncSeriesHook(["comilation"]), // 发射或者写入
      done: new AsyncSeriesHook(["stats"]), // 所有的编译全部的都完成
    };
  }

  emitAssets(compilation, callback) {
    // 把chunk变成文件，写入硬盘
    const emitFils = (err) => {
      const assets = compilation.assets;
      const outputPath = this.options.output.path;
      for (let file in assets) {
        let source = assets[file];
        // 是输出文件的绝对路径 C:/aaa/dist/main.js
        let targetPath = path.posix.join(outputPath, file);
        this.outputFileSystem.writeFileSync(targetPath, source, "utf8");
      }
      callback();
    };
    // 先触发emit的回调，在写插件的时候emit用的很多，因为它是我们修改输出内容的最后机会
    this.hooks.emit.callAsync(compilation, (err) => {
      // 先创建输出目录dist，再写入文件
      mkdirp(this.options.output.path, emitFils);
    });
  }

  // run方法是开始编译的入口
  run(callback) {
    const onCompiled = (err, compilation) => {
      this.emitAssets(compilation, (err) => {
        // 先收集编译信息 chunks entries modules files
        let stats = new Stats(compilation);
        // 再触发done这个钩子执行
        this.hooks.done.callAsync(stats, (err) => {
          callback(err, stats);
        });
      });
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

  compile(onCompiled) {
    const params = this.newCompilationParams();

    this.hooks.beforeCompile.callAsync(params, (err) => {
      this.hooks.compile.call(params);
      // 创建一个新compilation对象
      const compilation = this.newCompilation(params);
      // 触发make钩子的回调函数执行
      this.hooks.make.callAsync(compilation, (err) => {
        // 封装代码块之后编译就完成了
        compilation.seal((err) => {
          // 触发编译完成钩子
          this.hooks.afterCompile.callAsync(compilation, (err) => {
            onCompiled(err, compilation);
          });
        });
      });
    });
  }
}
module.exports = Compiler;
