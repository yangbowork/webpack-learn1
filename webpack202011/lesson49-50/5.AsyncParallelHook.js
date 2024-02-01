const { AsyncParallelHook } = require("tapable");
// 异步并行钩子 所有回调是同时开始的
// 等所有的回调都完成后才会调用最终的回调
const hook = new AsyncParallelHook(["name", "age"]);
console.time('cost')
hook.tapPromise("1", (name, age) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(1, name, age);
      resolve()
    }, 1000)
  })
});
hook.tapPromise("2", (name, age) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(2, name, age);
      resolve()
    }, 2000)
  })
});
hook.tapPromise("3", (name, age) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(3, name, age);
      resolve()
    }, 3000)
  })
});
// Promise.all()
hook.promise("xxx", 10).then((result) => {
  console.log(result);
  console.timeEnd('cost')
}).catch(err => {
  console.log('err', err);
})


// hook.tapAsync("1", (name, age, callback) => {
//   setTimeout(() => {
//     console.log(1, name, age);
//     callback()
//   }, 1000)
// });
// hook.tapAsync("2", (name, age, callback) => {
//   setTimeout(() => {
//     console.log(2, name, age);
//     callback()
//   }, 2000)
// });
// hook.tapAsync("3", (name, age, callback) => {
//   setTimeout(() => {
//     console.log(3, name, age);
//     callback()
//   }, 3000)
// });
// hook.callAsync("xxx", 10, (err) => {
//   console.log(err);
//   console.timeEnd('cost')
// });

// 输出结果
// 1 xxx 10
// 2 xxx 10
// 3 xxx 10
// undefined
// cost: 3.009s
