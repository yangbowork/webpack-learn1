const core = require("@babel/core");
const path = require("path");
/**
 *
 * @param {*} source 上一个loader传递给当前loader的内容或最原始模块内容
 * @param {*} inputSourceMap 上一个loader传递过来的sourceMap
 * @param {*} data 本loader额外的数据
 * @returns
 */
function loader(source, inputSourceMap, data) {
  console.log(data.name);
  // es6
  const options = {
    presets: ["@babel/preset-env"],
    inputSourceMap,
    sourceMaps: true, // 告诉babel我要生成sourceMap
    filename: path.basename(this.resourcePath),
  };
  // code 转换后的代码 map sourcemap ast 抽象语法树
  const { code, map, ast } = core.transform(source, options);
  return this.callback(null, code, map, ast);
}

loader.pitch = function (remainingRequest, previousRequest, data) {
  data.name = "babel-loader-pitch";
};

module.exports = loader;
/**
 * 当你需要返回多值的时候需要使用this.callback来传递多个值
 * 只需要返回一个值，可以直接return
 * map 可以让我们进行代码调试 debug的时候可以看到源代码
 * ast 如果你返回了ast给webpack，则webpack可以直接分析，不需要再自己转AST，节约时间
 */
