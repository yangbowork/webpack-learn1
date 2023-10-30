const { SyncHook } = require("tapable");
const path = require("path");
const fs = require("fs");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse");
const generator = require("@babel/generator");

// path.posix.sep /; path.sep不同操作系统的路径分隔符\/
function toUnixPath(entryPath) {
  return entryPath.replace(/\\/g, path.posix.sep);
}

const dirPath = process.cwd();

class Compiler {
  constructor(options) {
    this.options = options;
    this.hooks = {
      run: new SyncHook(), // 会在开始编译的时候触发
      done: new SyncHook(), // 会在完成编译的时候触发
    };
  }
  // 4.执行对象的run方法开始执行编译
  run() {
    this.hooks.run.call(); // 当调用run方法的时候会触发run这个钩子，进而执行它的回调函数
    // 5.根据配置中的entry找到入口文件，得到entry的绝对路径
    // c:\Users\ctzduser41\Desktop\learn-webpack\lesson32\src\index.js
    // 打包后的文件，所有的路径都是\ => /
    const entry = toUnixPath(
      path.resolve(this.options.context, this.options.entry)
    );
    // 6.从入口文件出发，调用所有配置的Loader对模块进行编译
    const entryModule = this.buildModule(entry);
    // 中间就是编译过程...
    this.hooks.done.call();
  }
  /**
   * 编译模块 1.读取模块文件
   * @param {*} modulePath
   * @returns
   */
  buildModule = (modulePath) => {
    const modules = [];
    // 读取原始源代码
    let originalSourceCode = fs.readFileSync(modulePath, "utf-8");
    // 查找此模块对应的loader对代码进行转换
    const rules = this.options.module.rules;
    let loaders = [];
    for (let i = 0; i < rules.length; i++) {
      // 正则匹配上了模块的路径
      if (rules[i].test.test(modulePath)) {
        loaders = [...loaders, ...rules[i].use];
      }
    }
    // loaders = ["logger1-loader.js", "logger2-loader.js", 'logger3-loader.js', 'logger4-loader.js', ];
    for (let i = loaders.length - 1; i >= 0; i--) {
      const loader = loaders[i];
      originalSourceCode = require(loader)(originalSourceCode);
    }

    const ast = parser.parse(originalSourceCode, { sourceType: "module" });
    // 遍历语法树，并找出require节点
    traverse(ast, {
      CallExpression: ({ node }) => {
        if (node.callee.name === "require") {
          console.log(node);
          // relativePath = path.relative(dirPath, modulePath);
        }
      },
    });

    return module;
  };
}

module.exports = Compiler;
