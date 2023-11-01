/**
 * loader-runner.js是一个独立的，运行loader的模块
 * 1.为什么说loader的执行是从右向左，从下向上
 * 2.为什么要分成四种loader？loader类型不同会决定执行的顺序
 * 因为loader的配置是分散的，它可能会由多个配置文件合并而来
 */
const { runLoaders } = require("loader-runner");
const path = require("path");
const fs = require("fs");
const filePath = path.resolve(__dirname, "./src/index.js");
// 这个在我们手写style-loader的时候会用到
const request = `inline-loader1!inline-loader2!${filePath}`;
const parts = request.replace(/^-?!+/, "").split("!");
const resource = parts.pop(); // 最后一个元素就是加载的资源了
const options = require("./webpack.config");
const resolveLoader = (loader) => path.resolve(__dirname, "loaders", loader);
// inlineLoaders = [inline-loader1绝对路径， inline-loader2绝对路径]
const inlineLoaders = parts.map(resolveLoader);
let preLoaders = [];
let postLoaders = [];
let normalLoaders = [];

const rules = options.module.rule;
for (let i = 0; i < rules.length; i++) {
  let rule = rules[i];
  if (rule.test.test(resource)) {
    if (rule.enforce === "pre") {
      preLoaders.push(...rule.use);
    } else if (rule.enforce === "post") {
      postLoaders.push(...rule.use);
    } else {
      normalLoaders.push(...rule.use);
    }
  }
}
preLoaders = preLoaders.map(resolveLoader);
postLoaders = postLoaders.map(resolveLoader);
normalLoaders = normalLoaders.map(resolveLoader);
let loaders = [];
if (request.startsWith("!!")) {
  // noPrePostAutoLoaders
  loaders = [...inlineLoaders];
} else if (request.startsWith("-!")) {
  // noPreAutoLoaders
  loaders = [...postLoaders, ...inlineLoaders];
} else if (request.startsWith("!")) {
  // noAutoloaders
  loaders = [...postLoaders, ...inlineLoaders, ...preLoaders];
} else {
  loaders = [...postLoaders, ...inlineLoaders, ...normalLoaders, ...preLoaders];
}

console.log(loaders);
/**
 * 1.读取要加载的资源
 * 2.把资源传递给loader链条，一一处理，最后得到结果
 */
runLoaders(
  {
    // 要加载和转换的资源 可以包含查询字符串
    resource,
    // loader的绝对路径数组
    loaders,
    // 额外的loader上下文对象
    context: { name: "xxx" },
    // 读取文件的方法
    readResource: fs.readFile.bind(fs),
  },
  function (err, result) {
    console.log(err);
    console.log(result);
  }
);
