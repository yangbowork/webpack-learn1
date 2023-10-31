// const { SyncHook } = require("tapable");

class SyncHook {
  constructor(args) {
    this.args = args;
    this.taps = [];
  }
  tap(name, fn) {
    this.taps.push(fn);
  }
  call() {
    const args =
      Array.prototype.slice.call(arguments, 0, this.args.length) || [];
    this.taps.forEach((tap) => tap(...args));
  }
}
// 不同的事件需要创建不同的hook
// 优点是结构会比较清晰
// webpack时间大概有四五百中，有几百个钩子，各干各的监听和出发，互不干扰
// 需要给构建函数传递一个形参
const aHook = new SyncHook(['a', 'age'])
const bHook = new SyncHook(['b', 'age'])
aHook.tap("这个名字没什么用，只是给程序员看的", (name) => {
  console.log(name, "这是一个回调");
});
aHook.call("a", 10);
bHook.tap("这个名字没什么用，只是给程序员看的", (name) => {
  console.log(name, "这是一个回调");
});
bHook.call("b", 10);

// tap类似于我们以前学的events库中的on监听事件
let syncHook = new SyncHook(["name"]);
syncHook.tap("这个名字没什么用，只是给程序员看的", (name) => {
  console.log(name, "这是一个回调");
});
syncHook.call("lalala");
