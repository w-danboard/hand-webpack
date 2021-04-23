// defineProperty方法可以在对象上定义一个新的属性，或者修改一个对象的现有属性，并返回这个对象
// Object.defineProperty(obj, key, {});

let obj = {};
let ageValue = 10;
/**
 * TypeError: Invalid property descriptor. Cannot both specify accessors and a value or writable attribute, #<Object>
 * 不能同时指定属性描述器和value
 */
Object.defineProperty(obj, 'age', {
  // value: 20, // 直接 指定value值
  // writable: true, // 表示可以修改value值
  get () {
    // getter 获取器函数
    return ageValue;
  },
  set (newValue) {
    ageValue = newValue;
  },
  enumerable: true, // 可以枚举 for in循环或者console.log的时候能看到这个属性
  configurable: true, // 此属性是否可以删除
});

console.log(obj.age);
obj.age = 30;
console.log(obj.age);