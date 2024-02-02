class SingleEntryPlugin {
  constructor(context, entry, name) {
    this.context = context; // 上下文绝对路径
    this.entry = entry; // 入口模块路径 ./src/index.js
    this.name = name; // 入口名字main
  }
  apply(compiler) {
    compiler.hooks.make.tapAsync(
      "SingleEntryPlugin",
      (compilation, callback) => {
        const { context, entry, name } = this;
        console.log("SingleEntryPlugin run");
        // 从此入口开始编译，编译入口文件和它的依赖 context根目录 entry入口文件的相对路径 name main callback最终回调
        compilation.addEntry(context, entry, name, callback);
      }
    );
  }
}

module.exports = SingleEntryPlugin;
