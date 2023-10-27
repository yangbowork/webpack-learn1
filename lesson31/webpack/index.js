const Compiler = require("./Compiler.js");

/**
 * process.argv 命令行参数
 * @param {*} options
 */
function webpack(options) {
  // 1.初始化参数：从配置文件和Shell语句中读取并合并参数，得出最终的配置对象
  // console.log(process.argv)
  // shell命令行执行
  const shellConfig = process.argv.slice(2).reduce((shellConfig, item) => {
    const [key, value] = item.split("="); // --mode=development
    return (shellConfig[key.slice(2)] = value);
  }, {});
  const finalOptions = { ...options, ...shellConfig }; // 得出最终的配置对象

  // 2.用上一步得到的参数初始化Compiler对象
  const compiler = new Compiler(finalOptions);

  // 3.加载所有配置的插件
  // finalOptions.plugins.forEach()
  if (finalOptions.plugins && Array.isArray(finalOptions.plugins)) {
    for (let plugin of finalOptions.plugins) {
      // 刚开始的时候，就会执行所有的插件实例的apply方法，并传递compiler实例
      plugin.apply(compiler);
    }
  }
  return compiler;
}
module.exports = webpack;
