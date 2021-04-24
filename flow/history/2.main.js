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

  // 把modules对象赋给__webpack_require__.m属性
  __webpack_require__.m = modules;

  // 把模块的缓存对象放在__webpack_require__.c上面
  __webpack_require__.c = installedModules;

  // 为了兼容导出定义getter函数
  __webpack_require__.d = function (exports, name, getter) {
    if (!__webpack_require__.o(exports, name)) {
      Object.defineProperty(exports, name, { enumerable: true, get: getter });
    }
  };

  // 其实就是把一个export对象，声明为一个es6模块
  __webpack_require__.r = function (exports) {
    if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
      Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
    }
    Object.defineProperty(exports, '__esModule', { value: true });
  };

  // 懒加载的时候用的
  // require.t 一般来说核心用法是用来把一个任意模块都变成一个es模块
  // import('./').then(result =>)..不管你懒加载的是一个common.js还是es6模块,偶会变成es6模块的格式
  // 包装es6模块 靠.t来实现的
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

  // 获取默认导出的函数，为了兼容非harmony模块 (harmony指的是common.js模块)
  __webpack_require__.n = function (module) {
    // 如果module有__esModule属性的话， 说明这个模块是一个es module，那么返回的是module.default
    // 如果没有__esModule属性，说明这是一个普通的common.js模块，那么直接返回module就可以了
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

  // 其实就是Object.prototye.hasOwnProperty简写
  __webpack_require__.o = function (object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
  };

  // 公开访问路径
  __webpack_require__.p = '';

  // 加载入口模块并且返回exports s是指定入口模块ID
  return __webpack_require__((__webpack_require__.s = './src/index.js'));
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