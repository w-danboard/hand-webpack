// let title = require('./title');
// let sum = require('./sum');
// let isarray = require('isarray');
// console.log(title);
// console.log(sum);
// console.log(isarray([]))

// import('./title').then(result => {
//   console.log(result.default)
// })

import module1 from './module1';
import module2 from './module2';
import isarray from 'isarray';

console.log(module1, module2, isarray)

import(/* webpackChunkname: 'asyncModule1' */ './asyncModule1')