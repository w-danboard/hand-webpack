1. es6 import export 如何实现的？
2. 第三方模块 ID 是怎样实现的？
3. 为什么 webpack_require__. 是一个字母？ （为了减少体积）
4. 为了压缩，那为什么有这么多的/** (只有在开发环境下有，生成环境是没有的)
5. 如果你得到一个模块，但你不知道它是个common.js还是esmodule, 该如何取值？ (靠的就是__esModule)


> 关于harmony 的4中情况

1. 如果是common.js 加载common.js 不需要做任何转换

```js
{
  "./src/index.js": (function(module, exports, require) {
    let title = require(/*! ./title */ "./src/harmony/1/title.js");
    console.log(title.name);
    console.log(title.age);
  }),
  "./src/title.js": (function(module, exports) {
    exports.name = 'title_wl';
    exports.age = 'title_18';
  })
}
```

2. common.js加载es6

```js
{
  "./src/harmony/2/index.js": (function(module, exports, require) {
    let title = require(/*! ./title */ "./src/title.js");
    console.log(title.default);
    console.log(title.age);
  }),
  "./src/title.js": (function(module, exports, require) {
    "use strict";
    // 先表明这是一个es6模块
    require.r(exports);
    // 给exports增加一个age属性，值为title_age
    /* harmony export (binding) */ require.d(exports, "age", function() { return age; });

    // 默认导出如何兼容，是往导出对象上挂载一个default属性
    /* harmony default export */ exports["default"] = 'title_name'; // 默认导出
    const age = 'title_age'; // 单个导出
  })
}
```
3. 引入的模块和被引入的模块，都是es6的话，都得转成common.js  因为webpack的核心就是common.js [es6加载es6]

```js
{
  "./src/index.js": (function(module, exports, require) {
    "use strict";
    require.r(exports); // exparts.__esModule = true;
    /* harmony import */
    var _title__WEBPACK_IMPORTED_MODULE_0__ = require(/*! ./title */ "./src/title.js");

    console.log(_title__WEBPACK_IMPORTED_MODULE_0__["default"])
    console.log(_title__WEBPACK_IMPORTED_MODULE_0__["age"])

  }),
  "./src/title.js": (function(module, exports, require) {
    "use strict";
    require.r(exports); // exparts.__esModule = true;
    /* harmony export (binding) */
    require.d(exports, "age", function() { return age; }); // exports.age = 'title_age';
    /* harmony default export */ 
    exports["default"] = ('title_name'); // 默认导出
    const age = 1
  })
}
```

4. es6加载common.js

```js
{
  './src/index.js': function (module, exports, require) {
    'use strict';
    require.r(exports); // exports.__esModule = true;  先表明是es6模块
    var _title__WEBPACK_IMPORTED_MODULE_0__ = require('./src/title.js');
    var _title__WEBPACK_IMPORTED_MODULE_0___default = require.n(
      _title__WEBPACK_IMPORTED_MODULE_0__
    );
    // _title__WEBPACK_IMPORTED_MODULE_0___default
    // function getModuleExports() {
    //   return module;
    // }
    console.log(_title__WEBPACK_IMPORTED_MODULE_0___default.a); // {name: 'title_name',age: 'title_age',}
    console.log(_title__WEBPACK_IMPORTED_MODULE_0__['age']);
  },
  './src/title.js': function (module, exports) {
      // common.js的没有改变
      module.exports = {
        name: 'title_name',
        age: 'title_age',
      };
    },
}
```

`总结`

- 1. 如果模块是用common.js写的，则不需要做任何转换
- 2. 如果模块里有 export 或者 import 或者 都有
  - require.r(exports); // exports.__esModule = true;  先表明是es6模块
  - 如果有默认导入的话，需要通过 require.n(title) 得到默认导入, title.default.a就是默认导入了 
  - 为啥要搞n，有什么用呢？因为根本不知道它是es6还是common.js的
  - 如果是批量导入， 直接取属性就可以了

---
### webpack有三个核心概念

- 模块：JS文件 CSS文件 图片
- 相互依赖的模块会合并成一个代码块
