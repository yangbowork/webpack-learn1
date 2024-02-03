const { Tapable, SyncHook } = require("tapable");
const NormalModuleFactory = require("./NormalModuleFactory");
const normalModuleFactory = new NormalModuleFactory();
const Parser = require("./Parser");
const parser = new Parser();
const path = require("path");
const async = require("neo-async");
const Chunk = require("./Chunk");
const ejs = require('ejs')
const fs = require('fs')
const mainTemplate = fs.readFileSync(path.posix.join(__dirname, 'templates', 'main.ejs'), 'utf8')
const mainRender = ejs.compile(mainTemplate)

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
    this.chunks = []; // 这里放着所有的代码块
    this.files = []; // 这里放着本次编译所有的产出的文件名
    this.assets = {}; // 存放着生成资源 key是文件名 值是文件的内容
    this.hooks = {
      // 当你成功构建完成一个模块后触发此钩子执行
      succeedModule: new SyncHook(["module"]),
      seal: new SyncHook(),
      beforeChunks: new SyncHook(),
      afterChunks: new SyncHook(),
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
    this.createModule(
      {
        name,
        context,
        rawRequest,
        parser,
        resource: path.posix.join(context, rawRequest),
      },
      (entryModule) => this.entries.push(entryModule),
      callback
    );
  }
  /**
   * 创建并编译一个模块
   * @param {*} data 要编译的模块信息
   * @param {*} addEntry
   * @param {*} callback
   */
  createModule(data, addEntry, callback) {
    const { name, context, rawRequest, resource, parser } = data;
    // 通过模块工厂创建一个模块
    let module = normalModuleFactory.create(data);
    addEntry && addEntry(module); // 如果是入口模块，则添加入口里去
    this.modules.push(module); // 给普通模块数组添加一个模块
    const afterBuild = (err, module) => {
      // 如果大于0，说明有依赖
      if (module.dependencies.length > 0) {
        this.processModuleDependencies(module, (err) => {
          callback(err, module);
        });
      } else {
        callback(err, module);
      }
    };
    this.buildModule(module, afterBuild);
  }
  /**
   * 处理编译模块依赖
   * @param {*} module ./src/index.js
   * @param {*} callback
   */
  processModuleDependencies(module, callback) {
    let dependencies = module.dependencies;

    async.forEach(
      dependencies,
      (dependency, done) => {
        const { name, context, rawRequest, resource, moduleId } = dependency;
        this.createModule(
          {
            name,
            context,
            rawRequest,
            parser,
            resource,
            moduleId,
          },
          null,
          done
        );
      },
      callback
    );
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
      afterBuild(err, module);
    });
  }
  /**
   * 把模块封装成代码块Chunk
   */
  seal(callback) {
    this.hooks.seal.call();
    this.hooks.beforeChunks.call(); // 准备开始生成代码块
    for (const entryModule of this.entries) {
      const chunk = new Chunk(entryModule); // 根据入口模块得到一个代码块
      this.chunks.push(chunk);
      // 对所有模块进行过滤，找出来哪些名称跟这个chunk一样的模块，组成一个数组赋给chunk.modules
      chunk.modules = this.modules.filter(
        (module) => module.name === chunk.name
      );
    }
    this.hooks.afterChunks.call();
    this.createChunkAssets();
    callback();
  }
  createChunkAssets() {
    for (let i = 0; i < this.chunks.length; i++) {
      const chunk = this.chunks[i];
      const file = chunk.name + ".js"; // 只是拿到了文件名
      chunk.files.push(file);
      let source = mainRender({
        entryModuleId: chunk.entryModule.moduleId, // ./src/index.js
        modules: chunk.modules // 此代码块对应的模块数组[{moduleId:"./src/index.js"}, {moduleId: "./src/title.js"}]
      });
      this.emitAssets(file, source);
    }
  }
  emitAssets(file, source) {
    this.assets[file] = source;
    this.files.push(file);
  }
}

module.exports = Compilation;
