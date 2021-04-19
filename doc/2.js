let async = require('neo-async'); // 它实现了类似promiseAll的效果

let arr = [1, 2, 3];

console.time('cost');

// 实现
function forEach(arr, callback, finalCallback) {
  let total = arr.length;
  function done () {
    if (--total == 0) {
      finalCallback()
    }
  }
  arr.forEach(item => {
    callback(item, done)
  })
}

// 同时开始，全部结束之后再打印console.timeEnd('cost')
async.forEach(arr, (item, done) => {
  setTimeout(() => {
    console.log(item)
    done();
  }, 1000 * item)
}, () => {
  console.timeEnd('cost');
});