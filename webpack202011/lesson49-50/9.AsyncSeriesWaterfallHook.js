const { AsyncSeriesWaterfallHook } = require("tapable");
const hook = new AsyncSeriesWaterfallHook(["name", "age"]);
console.time('cost')
hook.tapPromise("1", (name, age) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(1, name, age);
      resolve(1)
    }, 1000)
  })
});
hook.tapPromise("2", (number, age) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(2, number, age);
      resolve(++number)
    }, 2000)
  })
});
hook.tapPromise("3", (number, age) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(3, number, age);
      resolve(++number)
    }, 3000)
  })
});
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
// 2 1 10
// 3 2 10
// 3
// cost: 6.031s