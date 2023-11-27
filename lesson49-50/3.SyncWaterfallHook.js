const { SyncWaterfallHook } = require("tapable");
// 如果上一个回调函数返回结果不为undefined，则会作为下一个回调函数的第一个参数
const syncWaterfallHook = new SyncWaterfallHook(["name", "age"]);

syncWaterfallHook.tap("1", (name, age) => {
  console.log(1, name, age);
  return null;
});
syncWaterfallHook.tap("2", (name, age) => {
  console.log(2, name, age);
});
syncWaterfallHook.tap("3", (name, age) => {
  console.log(3, name, age);
});
syncWaterfallHook.call("xxx", 10);

// 输出结果
// 1 xxx 10
// 2 null 10
// 3 null 10