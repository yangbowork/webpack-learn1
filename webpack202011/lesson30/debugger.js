// 引入核心模块
const webpack = require("webpack");
// 加载配置文件
const options = require("./webpack.config");
// 执行webpack得到编译对象Compiler，就是一个大管理，是核心编译对象
const compiler = webpack(options);
// 调用它的run方法开始启动编译
debugger;
compiler.run((err, stats) => {
  // webpack4都是数组 webpack5都是set
  // 编译完成执行回调
  console.log(err); // 错误信息
  // stats是编译结果的描述对象
  console.log(
    JSON.stringify(
      stats.toJson({
        assets: true, // 产出的资源 [main.js]
        chunks: true, // 代码块 [main]
        modules: true, // 模块 ['./src/index.js', './src/title.js']
        entries: true, // 入口 ['./src/index.js']
      })
    )
  );
});
// namedChunkGroups是命名的代码块的组，这个概念是webpack4引入的，是为了实现代码分割 splitChunks
