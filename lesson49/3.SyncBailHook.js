const { SyncBailHook } = require("tapable");
// 当回调函数返回非undefined的值的时候会停止后续调用
const syncBailHook = new SyncBailHook(["name", "age"]);

syncBailHook.tap("1", (name, age) => {
  console.log(1, name, age);
});
syncBailHook.tap("2", (name, age) => {
  console.log(2, name, age);
  return null
});
syncBailHook.tap("3", (name, age) => {
  console.log(3, name, age);
});
syncBailHook.call("xxx", 10);

// 输出结果
// 1 xxx 10
// 2 xxx 10