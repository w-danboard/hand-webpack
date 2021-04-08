const { Tapable, AsyncSeriesHook, SyncBailHook, AsyncParallelHook, SyncHook } = require('tapable');
const NormalModuleFactory = require('./NormalModuleFactory');
// 编译器对象
class Compiler extends Tapable {
  constructor (context) {
    super();
    this.context = context;
    this.hooks = {
      // done: new AsyncSeriesHook(['stats']) // 当编译完成后会触发这个钩子执行
      // context项目根目录的绝对路径 /Users/wanglin/Desktop/webpack-not-del/hand-webpack
      // entry入口文件的路径 ./src/index.js
      entryOption: new SyncBailHook(['context', 'entry']),
      beforeRun: new AsyncSeriesHook(['compiler']), // 运行前
      run: new AsyncSeriesHook(['compiler']), // 运行
      beforeCompile: new AsyncSeriesHook(['params']), // 编译前
      compile: new SyncHook(['params']),  // 编译
      make: new AsyncParallelHook(['complation']), // make构建 // TODO
      thisCompilation: new SyncHook(['compilation', 'params']), // 开始一次新的编译
      compilation: new SyncHook(['compilation', 'params']), // 创建完成一个新的compilation
      afterCompile: new AsyncSeriesHook(['compilation']) // 编译完成
    }
  }

  // run方法是开始编译的入口
  run (callback) {
    console.log('Compiler run');
    // 编译完成最终的回调函数
    const finalCallback = (err, stats) => {
      callback(err, stats)
    };
    const onCompiled = (err, compilation) => {
      console.log('onCompiled');
      finalCallback(err, {
        entries: [], // 显示所有的入口
        chunks: [], // 显示所有的代码块
        module: [], // 显示所有的模块 [数组]
        assets: [] // 显示所有打包后的资源，也就是文件
      });
    }
    this.hooks.beforeRun.callAsync(this, err => {
      this.hooks.run.callAsync(this, err => {
        this.compile(onCompiled);
      });
    });
  }

  compile (onCompiled) {
    const params = this.newCompilationParams();
    this.hooks.beforeCompile.callAsync(params, err => {
      this.hooks.compile.call(params);
      const compilation = this.newCompilation(params);
      this.hooks.make.callAsync(compilation, err => {
        console.log('make完成');
        onCompiled();
      });
    })
  }

  createCompilation () {
    return new Compilation(this);
  }

  newCompilation (params) {
    const compilation = this.createCompilation();
    this.hooks.thisCompilation.call(compilation, params);
    this.hooks.compilation.call(compilation, params);
    return compilation;
  }

  newCompilationParams () {
    const params = {
      // 在创建compilation之前，已经创建了一个普通模块工厂
      normalModuleFactory: new NormalModuleFactory()
    };
    return params;
  }
}

module.exports = Compiler;