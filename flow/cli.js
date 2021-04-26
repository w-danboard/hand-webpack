const webpack = require('./webpack');
const options = require('./webpack.config');
const compiler = webpack(options);

compiler.run((err, stats) => {
  console.log(err);
  console.log(stats.toJson({
    entries: true, // 显示入口
    chunks: true, // 显示打包出来的代码块
    modules: true,  // 以数组的方式放置模块
    _modules: true, // 以对象的方式放置模块
    assets: true // 产出的文件或资源
  }));
});