let mode = 0b0000;
console.log(!!(mode & 1));

// 为了减少 if else 不需要加那么多的判断
// 十进制里的2转为二进制
console.log(mode & 0b0010); // 0

console.log(8 | 1); // 按位或
console.log(0b1000 | 0b0001); // 0b1001