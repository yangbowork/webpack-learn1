const path = require("path");
const types = require("babel-types");
const generate = require("babel-generator").default;
const traverse = require("babel-traverse").default;
class NormalModule {
  constructor({ name, context, rawRequest, resource, parser, moduleId }) {
    this.name = name;
    this.context = context;
    this.rawRequest = rawRequest;
    this.resource = resource; // 模块的绝对路径
    // 这是AST解析器，可以把源代码转成AST抽象语法树
    this.parser = parser;
    this.moduleId = moduleId || "./" + path.posix.relative(context, resource);
    // 此模块对应的源代码
    this._source;
    // 此模块对应的AST抽象语法树
    this._ast;
    // 当前模块依赖的模块信息
    this.dependencies = [];
  }
  /**
   * 编译本模块
   * @param {*} compilation
   * @param {*} callback
   */
  build(compilation, callback) {
    this.doBuild(compilation, (err) => {
      // 得到语法树
      this._ast = this.parser.parse(this._source);
      // 遍历语法树，找到里面的依赖进行依赖收集
      traverse(this._ast, {
        // 当遍历到CallExpression节点的时候，就会进入回调
        CallExpression: (nodePath) => {
          const node = nodePath.node; // 获取节点

          if (node.callee.name === "require") {
            // 把方法名用require改成了__webpack_require__;
            node.callee.name = "__webpack_require__";
            // 如果方法名是require方法的话
            const moduleName = node.arguments[0].value; // 模块的名字
            // 获取了可能的扩展名
            let extName =
              moduleName.split(path.posix.sep).pop().indexOf(".") === -1
                ? ".js"
                : "";
            // 获取依赖模块（./src/title.js）的绝对路径
            let depResource = path.posix.join(
              path.posix.dirname(this.resource),
              moduleName + extName
            );
            // 依赖的模块ID ./ + 从根目录出发到依赖模块的绝对路径的相对路径
            let depModuleId =
              "./" + path.posix.relative(this.context, depResource);
            // 把require模块路径从./title.js变成了./src/title.js
            node.arguments = [types.stringLiteral(depModuleId)];
            this.dependencies.push({
              name: this.name, // main
              context: this.context, // 根目录
              rawRequest: moduleName, // 模块的相对路径 原始路径
              moduleId: depModuleId, // 模块ID 他是一个相对于根目录的相对路径，以./开头
              resource: depResource, // 依赖模块的绝对路径
            });
          }
        },
      });
      // 把转换后的语法树重新生成源代码
      let { code } = generate(this._ast);
      this._source = code;
      callback();
    });
  }
  /**
   * 1、读取模块的源代码
   * @param {*} compilation
   * @param {*} callback
   */
  doBuild(compilation, callback) {
    this.getSource(compilation, (err, source) => {
      this._source = source;
      callback();
    });
  }
  /**
   * 读取真正的源代码
   */
  getSource(compilation, callback) {
    compilation.inputFileSystem.readFile(this.resource, "utf8", callback);
  }
}
module.exports = NormalModule;

/**
 * 1、从硬盘上把模块内容读出来，读成一个文本
 * 2、可能它不是一个JS模块，所以会可能要走loader的转换，最终得到一个JS模块代码，得不到报错
 * 3、把这个JS模块经过parser处理转成抽象语法树AST
 * 4、分享AST里面的依赖，也就是找 require import节点，分析依赖的模块
 * 5、递归的编译依赖的模块
 * 6、不停地依次递归执行上面5步，直到所有的模块都编译完成为止
 */

/**
 * 模块ID的问题
 * 不管是相对的本地模块，还是第三方模块
 * 最后它的moduleId全部都一个相对相对于项目根目录打包路径
 * ./src/title.js
 * ./src/index.js
 * ./node_modules/util/util.js
 * 分隔符一定是 “/” 是linux中的“/” 而不是windows中的“\”
 */
