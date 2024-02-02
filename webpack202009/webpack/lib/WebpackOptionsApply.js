const EntryOptionPlugin = require("./EntryOptionPlugin");

/**
 * 挂载各种各样的内置插件
 */
class WebpackOptionsApply {
  process(options, compiler) {
    // 注册插件
    new EntryOptionPlugin().apply(compiler);
    // 触发entryOption钩子 context就是根目录的路径；entry入口'./src/index.js'
    compiler.hooks.entryOption.call(options.context, options.entry);
  }
}

module.exports = WebpackOptionsApply;
