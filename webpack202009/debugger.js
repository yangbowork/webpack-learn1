const webpack = require("./webpack");
const webpackOptions = require("./webpack.config");

debugger;
const compiler = webpack(webpackOptions);
compiler.run((err, stats) => {
  console.log(stats.toJson());
});
