const { AsyncParallelBailHook } = require("tapable");
// 有一个任务返回值不为空就直接结束
// 对于promise来说，就是resolve的值不为空
// 如果reject失败了，不影响流程
// 只要有一个任务resolve或者reject一个值，不管成功失败都会结束
const hook = new AsyncParallelBailHook(["name", "age"]);
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
