const { SyncLoopHook } = require("tapable");
// 不停的循环执行回调函数，知道函数的结果等于undefined
// 特别要注意是每次循环都是从头开始
const syncLoopHook = new SyncLoopHook(["name", "age"]);
let counter1 = 0;
let counter2 = 0;
let counter3 = 0;

syncLoopHook.tap("1", (name, age) => {
  console.log(1, "counter1", counter1);
  if (++counter1 == 1) {
    counter1 = 0;
    return; // 返回undefined就表示当前回调函数循环结束
  }
  return true;
});
syncLoopHook.tap("2", (name, age) => {
  console.log(2, "counter2", counter2);
  if (++counter2 == 2) {
    counter2 = 0;
    return; // 返回undefined就表示当前回调函数循环结束
  }
  return true;
});
syncLoopHook.tap("3", (name, age) => {
  console.log(3, "counter3", counter3);
  if (++counter3 == 3) {
    counter3 = 0;
    return; // 返回undefined就表示当前回调函数循环结束
  }
  return true;
});
syncLoopHook.call("xxx", 10);

// 输出结果
// 1 counter1 0
// 2 counter2 0
// 1 counter1 0
// 2 counter2 1
// 3 counter3 0
// 1 counter1 0
// 2 counter2 0
// 1 counter1 0
// 2 counter2 1
// 3 counter3 1
// 1 counter1 0
// 2 counter2 0
// 1 counter1 0
// 2 counter2 1
// 3 counter3 2
