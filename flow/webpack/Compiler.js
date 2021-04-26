const { Tapable, SyncBailHook, AsyncParallelHook } = require('tapable');

class Compiler extends Tapable {
  constructor (context) {
    super();
    this.options = {};
    // compiler实例上还会挂载很多钩子
    this.hooks = {
      entryOptions: new SyncBailHook(['context', 'entry']),
      make: new AsyncParallelHook(['compilation'])
    }
    this.context = context; // compiler.context = 当前的工作目录
  }
  run (callback) {
    console.log('Compiler.run');
    callback(null, {
      toJson () {
        return {
          entries: true, // 显示入口
          chunks: true, // 显示打包出来的代码块
          modules: true,  // 以数组的方式放置模块
          _modules: true, // 以对象的方式放置模块
          assets: true // 产出的文件或资源
        }
      }
    });
  }
}

module.exports = Compiler;