class ReadmePlugin {
  constructor(options) {
    this.options = options;
  }
  apply(compiler) {
    compiler.hooks.emit.tap("ReadmePlugin", () => {
      // 让你可以在插件改变输出的结果
      compiler.assets["README.md"] = "读我读我";
    });
  }
}

module.exports = ReadmePlugin;
