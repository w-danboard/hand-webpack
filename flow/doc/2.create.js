Object.create = function (proto) {
  function F () {}
  F.prototype = proto
  return new F()
} 

let ns1 = {};
console.log(ns1, Object.getPrototypeOf(ns1)); // Object.prototype
for (let key in ns1) {
  if (ns1.hasOwnProperty(key)) {
    console.log(key, 'ns1')
  }
}
// 使用Object.create(null) 创建的对象，没有任何属性，可以当做一个非常干净的map来用
let ns2 = Object.create(null);
console.log(ns2, Object.getPrototypeOf(ns2));
for (let key in ns2) {
  // if (ns1.hasOwnProperty(key)) {
    console.log(key, 'ns2')
  // }
}
