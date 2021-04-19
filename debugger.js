// webpack是一个函数，要执行它
const webpack = require('./webpack');
// 1. 初始化参数，从配置文件中读取配置对象，然后和shell参数进行合并得到最终的配置对象
/**
 * "scripts": {
    "build": "webpack --mode=development"
    }
    --mode=development 就是shell参数，会覆盖webpack.config.js中的mode配置
 */
const webpackOptions = require('./webpack.config');

// 2. 用上一步得到的参数对象，去初始化compiler对象，（compliler对象可以理解成一个大管家，工厂中的厂长，哈哈哈）
const compiler = webpack(webpackOptions);

// 4. 调用Compiler对象的run方法开始执行编译工作
compiler.run((err, stats) => {
  console.log(err)
  console.log(
    stats.toJson({
      entries: true, // 入口信息
      chunks: true, // 本次打包有哪些模块
      modules: true, // 代码块
      assets: true, // 产出的资源
      files: true // 最后生成了哪些文件
    })
  )
});