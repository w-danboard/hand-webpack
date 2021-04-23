// toStringFlag
console.log(Object.prototype.toString.call('danboard'));

// 如果我们想更进一步的区分类型的话
let obj = {};
// Object.defineProperty(obj, Symbol.toStringTag, { value: 'Module' });
obj[Symbol.toStringTag] = 'Module';
console.log(Object.prototype.toString.call(obj));