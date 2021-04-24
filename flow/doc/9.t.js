// create a fake namespace object 创建一个模拟的命名空间对象，不管什么模块都转成es6模块
// mode & 1: value is a module id, require it value是一个模块ID，需要用require加载
// mode & 2: merge all properties of value into the ns
// mode & 4: return value when already ns object 如果已经是ns对象了，则直接返回
// mode & 8 | 1: behave like require 等同于require方法 (按位或 有一个为1就是1)

// 在浏览器里自己实现了一套common.js require方法
var installedModules = {};
let modules = {
  moduleA: function (module, exports) {
    exports.value = 'moduleA';
  },
  moduleB: function (module, exports) {
    exports.__esModule = true; // 表示这个一个es6模块
    exports.default = { value: 'moduleB'}; // 在导出对象的default属性才是真正的导出对象
  }
};
function require(moduleId) {
  // 为此模块ID创建一个新的模块，并且放到缓存中
  var module = (installedModules[moduleId] = {
    i: moduleId, // identify 模块ID 模块标识符
    l: false, // loaded 是否已经加载成功或者说初始化成功
    exports: {}, // 此模块的导出对象
  });

  // 执行模块函数 this = module.exports
  modules[moduleId].call(
    module.exports,
    module,
    module.exports,
    require
  );

  // 返回此模块的导出对象
  return module.exports;
}

require.r = function (exports) {
  if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
  }
  Object.defineProperty(exports, '__esModule', {
    value: true,
    enumerable: true
  });
};

// let mode = 0b1111;
require.t = function (value, mode) {
  // 1转为二进制就是 0b0001
  if (mode & 1) value = require(value); // value = { value: 'module1' }
  // 0b1000 & ob1001 等到8 8也是ture 所以直接返回了
  if (mode & 8) return value;
  // 0b0100 value已经是es模块了，可以直接返回
  if (mode & 4 && typeof value === 'object' && value && value.__esModule)
    return value;
  var ns = Object.create(null); // 创建一个空对象
  require.r(ns); // ns.__esModule=true
  Object.defineProperty(ns, 'default', { enumerable: true, value: value }); // ns.default=value 相当于一个包装
  // 0b0010
  console.log(value)
  if (mode & 2 && typeof value != 'string')
    // 把值拷贝到ns上
    for (var key in value)
      ns[key] = value[key]; // 和以下写法是一样的
      // require.d(
      //   ns,
      //   key,
      //   function (key) {
      //     return value[key];
      //   }.bind(null, key)
      // );
  return ns;
};

// let r1 = require.t('moduleA', 0b1001);
// console.log(r1); // { value: 'moduleA' } 直接返回了

// let r2 = require.t('moduleB', 0b0101);
// console.log(r2);

// let r3 = require.t('moduleA', 0b0001);
// console.log(r3);

let r4 = require.t('moduleA', 0b0011); // 会加value
console.log(r4);

/**
 * 为啥这样写？
 *  1.为了性能，二进制操作是最快的，也是最节约内存的，像权限 react大量使用
 */

// mode是在不同的情况下写死的