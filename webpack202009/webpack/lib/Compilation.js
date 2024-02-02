const { Tapable, SyncHook } = require("tapable");
const NormalModuleFactory = require("./NormalModuleFactory");
const normalModuleFactory = new NormalModuleFactory();
const Parser = require("./Parser");
const parser = new Parser();
const path = require("path");

class Compilation extends Tapable {
  constructor(compiler) {
    super();
    this.compiler = compiler; // 编译器对象
    this.options = compiler.options; // 选项一样
    this.context = compiler.context; // 根目录
    this.inputFileSystem = compiler.inputFileSystem; // 读取文件模块fs
    this.outputFileSystem = compiler.outputFileSystem; // 写入文件模块fs
    this.entries = []; // 入口的数组，这里放着所有的入口模块
    this.modules = []; // 模块的数组，这里放着所有的模块
    this.hooks = {
      // 当你成功构建完成一个模块后触发此钩子执行
      succeedModule: new SyncHook(["module"]),
    };
  }
  /**
   * 开始编译一个新的入口
   * @param {*} context 根目录
   * @param {*} entry 入口模块的相对路径 ./src/index.js
   * @param {*} name 入口名字 main
   * @param {*} callback 编译完成的回调
   */
  addEntry(context, entry, name, finalCallback) {
    this._addModuleChain(context, entry, name, (err, module) => {
      finalCallback(err, module);
    });
  }
  _addModuleChain(context, rawRequest, name, callback) {
    // 通过模块工厂创建一个模块
    let entryModule = normalModuleFactory.create({
      name, // main
      context, // 根目录
      rawRequest, // ./src/index.js
      resource: path.posix.join(context, rawRequest), // 入口绝对路径
      parser,
    });
    this.entries.push(entryModule); // 给入口模块数组添加一个模块
    this.modules.push(entryModule); // 给普通模块数组添加一个模块
    const afterBuild = (err) => {
      return callback(err, entryModule);
    };
    this.buildModule(entryModule, afterBuild);
  }
  /**
   * 编译模块
   * @param {*} module 要编译的模块
   * @param {*} afterBuild 编译完成后的回调
   */
  buildModule(module, afterBuild) {
    // 模块的真正编译逻辑其实是放在module内部完成
    module.build(this, (err) => {
      // 走到这里意味着一个module模块已经编译完成了
      this.hooks.succeedModule.call(module);
      afterBuild(err);
    });
  }
}

module.exports = Compilation;
