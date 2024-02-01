const webpack = require("./webpack");
const webpackOptions = require("./webpack.config");

debugger;
const compiler = webpack(webpackOptions);
compiler.run((err, stats) => {
  console.log(err);
  console.log(111111111);
  console.log(
    stats.toJson({
      entries: true, // entrypoints入口
      chunks: true, // 代码块
      modules: true, // 打包的模块数组
      assets: true, // 本次产出的文件
    })
  );
});
