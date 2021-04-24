  // 获取默认导出的函数，为了兼容非harmony模块
  // __webpack_require__.n = function (module) {
  //   // 如果module有__esModule属性的话， 说明这个模块是一个es module，那么返回的是module.default
  //   // 如果没有__esModule属性，说明这是一个普通的common.js模块，那么直接返回module就可以了
  //   var getter =
  //     module && module.__esModule
  //       ? function getDefault() {
  //           return module['default'];
  //         }
  //       : function getModuleExports() {
  //           return module;
  //         };
  //   __webpack_require__.d(getter, 'a', getter);
  //   return getter;
  // };

  require.d = function (exports, name, getter) {
    if (!require.o(exports, name)) {
      Object.defineProperty(exports, name, { 
        enumerable: true, // 可枚举
        get: getter  // get方法
      });
    }
  };

  require.o = function (object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
  };

  require.n = function (module) {
    var getter =
      module && module.__esModule
        ? function getDefault() {
            return module['default'];
          }
        : function getModuleExports() {
            return module;
          };
    // 因为a是第一个英文字母，这个地方用什么都可以
    require.d(getter, 'a', getter);
    return getter;
  };

  // common.js模块
  // let m = { name: 'wl' };
  // let getter = require.n(m);
  // console.log(getter.a);

  // 如果是es6的模块
  let esModule = { __esModule: true, default: { name: 'wl' } };
  let getter = require.n(esModule);
  console.log(getter.a);

  // 当webpack得到一个模块之后，会遍历这个模块所有语句，如果返现任意一个export import节点
  // 就会认定这个es6模块，就会导出的时候增加__esModule=true的属性