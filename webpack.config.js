const path = require('path');
console.log(process.cwd())
module.exports = {
  context: process.cwd(), // 当前工作目录
  mode: 'development',
  devtool: false,
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  }
}