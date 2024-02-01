const { getOptions, interpolateName } = require("loader-utils");
/**
 * file-loader负责打包加载图片
 * 1.把此文件内容拷贝到目标目录里
 * @param {*} content 
 * @returns 
 */
function loader(content) {
  // this = loaderContext
  const options = getOptions(this) || {}; // 获取我们在loader中配置的参数对象
  const filename = interpolateName(this, options.name, { content });
  // 其实就是想输出目录里多写一个文件,文件名叫filename,内容
  this.emitFile(filename, content); // this.assets[file]=content
  if (typeof options.esModule === "undefined" || options.esModule) {
    return `export default "${filename}"`; // es modules
  } else {
    return `module.exports="${filename}"`; // commonjs
  }
}

loader.raw = true;

module.exports = loader;
