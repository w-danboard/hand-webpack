// 为了兼容导出定义getter函数
// __webpack_require__.d = function (exports, name, getter) {
//   if (!__webpack_require__.o(exports, name)) {
//     Object.defineProperty(exports, name, { enumerable: true, get: getter });
//   }
// };

require.o = function (object, property) {
  // 判断object身上有没有property属性
  return Object.prototype.hasOwnProperty.call(object, property);
};

// 给exports添加一个属性，属性的取值方式就是getter，一个函数
require.d = function (exports, name, getter) {
  if (!require.o(exports, name)) {
    Object.defineProperty(exports, name, { 
      enumerable: true, // 可枚举
      get: getter  // get方法
    });
  }
};

let obj = { name: 'danboard' };

require.d(obj, 'age', function () {
  return 10;
})

console.log(obj.age);