require('./sync');
// 如果遇到了import，那么import的模块会成为一个单独的入口，会生成一个单独的代码块，会生成一个单独的文件
// 如果import调用了一个模块，那么这个模块和它依赖的模块会成一个单独的异步代码块，里面所有的模块isAsync都等于true
import(/* webpackChunkName: 'title' */'./title').then(result => {
  console.log(result.default);
});

// import(/* webpackChunkName: 'sum' */'./sum').then(result => {
//   console.log(result.default)
// });

// let isarray = require('isarray');
// console.log(isarray([1, 2, 3]));