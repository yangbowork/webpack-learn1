const { SyncHook } = require("tapable");
// 参数是形参的数组，参数名没有意义，但是数组长度有用
const syncHook = new SyncHook(["name", "age"]);
// 第一个参数是名，名字没有用
/**
 * 1.第一个参数是名，名字没有用
 * 2.回调函数的执行顺序和放入的顺序有关。先放先执行
 */
syncHook.tap("1", (name, age) => {
  console.log(name, age);
});
syncHook.tap("2", (name, age) => {
  console.log(name, age);
});
syncHook.tap("3", (name, age) => {
  console.log(name, age);
});
syncHook.call("xxx", 10);

// 输出结果
// xxx 10
// xxx 10
// xxx 10
