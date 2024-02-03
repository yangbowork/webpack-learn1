// require("./sync");
// // 如果遇到了import，那么import的模块会成为一个单独的入口，会生成一个单独的代码块，会生成一个单独的文件
// import(/*webpackChunkName: "title"*/ "./title.js").then((result) => {
//   console.log(result.default);
// });
// import(/*webpackChunkName: "sum"*/ "./sum.js").then((result) => {
//   console.log(result.default);
// });

const isArray = require("isarray");
console.log(isArray([]));
