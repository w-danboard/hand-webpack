const { Tapable, SyncBailHook, AsyncParallelHook, AsyncSeriesHook, SyncHook } = require('tapable');
const NormalModuleFactory = require('./NormalModuleFactory');
class Compiler extends Tapable {
  constructor (context) {
    super();
    this.options = {};
    // compiler实例上还会挂载很多钩子
    this.hooks = {
      // 入口选项解析入口
      entryOptions: new SyncBailHook(['context', 'entry']),
      // 真正的开启构建流程 它是异步并行钩子
      make: new AsyncParallelHook(['compilation']),
      // 运行前
      beforeRun: new AsyncSeriesHook(['compiler']),
      // 运行
      run: new AsyncSeriesHook(['compiler']),
      // 编译前
      beforeCompile: new AsyncSeriesHook(['params']),
      // 编译
      compile: new SyncHook(['params']),
      // 开启一次新的编译
      thisCompilation: new SyncHook(['compilation', 'params']),
      // 创建成功一次新的compilation对象
      compilation: new SyncBailHook(['compilation', 'params']),
      // 编译完成
      done: new AsyncSeriesHook(['stats']),
    }
    this.context = context; // compiler.context = 当前的工作目录
  }
  run (callback) {
    console.log('Compiler.run');
    const onCompiled = (err, compilation) => {
      callback(null, {});
    }
    this.hooks.beforeRun.callAsync(this, err => {
      this.hooks.run.callAsync(this, err => {
        this.compile(onCompiled);
      });
    });
    // callback(null, {
    //   toJson () {
    //     return {
    //       entries: true, // 显示入口
    //       chunks: true, // 显示打包出来的代码块
    //       modules: true,  // 以数组的方式放置模块
    //       _modules: true, // 以对象的方式放置模块
    //       assets: true // 产出的文件或资源
    //     }
    //   }
    // });
  }

  compile (onCompiled) {
    const params = this.newCompilationParams(); // 创建参数
    this.hooks.beforeCompile.callAsync(params, err => {
      this.hooks.compile.call(params);
      let compilation = this.newCompilation(params);
      this.hooks.make.callAsync(compilation, err => {
        onCompiled(err, compilation);
      })
    })
  }

  newCompilation (params) {
    const compilation = new compilation(this);
    this.hooks.thisCompilation.call(compilation, params);
    this.hooks.compilation.call(compilation, params);
    return compilation;
  }
  
  newCompilationParams () {
    // 普通模块工厂 我们在webpack中是靠模块工厂来创建模块的
    return {
      normalModuleFactory: new NormalModuleFactory()
    }
  }
}

module.exports = Compiler;