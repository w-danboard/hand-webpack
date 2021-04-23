(function (modules) {
  // 模块缓存是一个对象
  var installedModules = {};

  // 在浏览器里自己实现了一套common.js require方法
  function __webpack_require__(moduleId) {
    // 检查模块是否在缓存中存在 如果存在 则直接返回缓存中的模块对象
    if (installedModules[moduleId]) {
      return installedModules[moduleId].exports;
    }
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
      __webpack_require__
    );

    // 把此模块设置为已经加载成功
    module.l = true;

    // 返回此模块的导出对象
    return module.exports;
  }

  __webpack_require__.m = modules;

  __webpack_require__.c = installedModules;

  __webpack_require__.d = function (exports, name, getter) {
    if (!__webpack_require__.o(exports, name)) {
      Object.defineProperty(exports, name, { enumerable: true, get: getter });
    }
  };

  __webpack_require__.r = function (exports) {
    if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
      Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
    }
    Object.defineProperty(exports, '__esModule', { value: true });
  };

  __webpack_require__.t = function (value, mode) {
    if (mode & 1) value = __webpack_require__(value);
    if (mode & 8) return value;
    if (mode & 4 && typeof value === 'object' && value && value.__esModule)
      return value;
    var ns = Object.create(null);
    __webpack_require__.r(ns);
    Object.defineProperty(ns, 'default', { enumerable: true, value: value });
    if (mode & 2 && typeof value != 'string')
      for (var key in value)
        __webpack_require__.d(
          ns,
          key,
          function (key) {
            return value[key];
          }.bind(null, key)
        );
    return ns;
  };

  __webpack_require__.n = function (module) {
    var getter =
      module && module.__esModule
        ? function getDefault() {
            return module['default'];
          }
        : function getModuleExports() {
            return module;
          };
    __webpack_require__.d(getter, 'a', getter);
    return getter;
  };

  __webpack_require__.o = function (object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
  };

  __webpack_require__.p = '';

  // 加载入口模块并且返回exports
  // return __webpack_require__((__webpack_require__.s = './src/index.js'));
})({
  './src/index.js': function (module, exports, __webpack_require__) {
    let title = __webpack_require__(/*! ./title */ './src/title.js');
    console.log(title);
  },
  './src/title.js': function (module, exports) { // __webpack_require__ 它需要require其他模块就有这个参数，没有require其他参数就没有
    module.exports = 'title';
  },
});

/**
 * 参数是一个对象
 * key是模块ID，其实就是相对于项目根目录的相对路径
 * 值是一函数，是一个common.js的模块定义
 *  你写的模块代码，将会成为common.js模块的函数体
 */