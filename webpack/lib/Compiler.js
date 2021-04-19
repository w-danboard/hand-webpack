const { Tapable, AsyncSeriesHook, SyncBailHook, AsyncParallelHook, SyncHook } = require('tapable');
const NormalModuleFactory = require('./NormalModuleFactory');
const Compilation = require('./Compilation');
const Stats = require('./Stats');

let { toUnixPath } = require('./utils');
let path = require('path');
let fs = require('fs');
let types = require('babel-types'); // 判断某个节点是否是某种类型，生成某个新的节点
let parser = require('babel-parser'); // 把源码生成AST语法树 用的就是babylon
let traverse = require('babel-traverse').default; // 遍历器 用来遍历语法树
let generator = require('babel-generator').default; // 生成器 根据语法树重新生成代码
// 编译器对象
class Compiler extends Tapable {
  constructor (options) {
    super();
    this.options = options;
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
    this.entries = new Set(); // 所有的入口模块 (webpack4使用的是数组， webpack5使用的Set。刚看了一眼5里是Map~~~)
    this.modules = new Set(); // 所有的模块
    this.chunks = new Set(); // 所有的代码块
    this.assets = {}; // 存放着本次要产出的文件
    this.files = new Set(); // 存放着本次编译所有的产出文件名
  }

  buildModule (entryName, modulePath) {
    // 1.读取出来此模块的内容
    let originalSourceCode = fs.readFileSync(modulePath, 'utf8'); // 源码中毒文件这里也是异步的
    let targetSourceCode = originalSourceCode;
    // 2.调用所有配置的Loader对象进行编译
    let rules = this.options.module.rules;
    // 得到了本文件模块生效的loader有哪些
    let loaders = [];
    for (let i = 0; i < rules.length; i++) {
      // if (rules[i].test.test(modulePath)) {
        // 等同于如下
      // }
      if (modulePath.match(rules[i].test)) {
        loaders = [...loaders, ...rules[i].use];
      }
    }
    // 源码里多个入口可以一步并行的 （没有处理loader是对象的情况）
    for (let i = loaders.length - 1; i >= 0; i--) {
      console.log(loaders.length, '==>', i)
      targetSourceCode = require(loaders[i])(targetSourceCode);
      console.log(targetSourceCode)
    }
    // 7. 再找出该模块依赖的模块，再递归本步骤知道所有入口依赖的文件都经过了本步骤的处理
    // A模块依赖B模块依赖C (所有的模块ID都是一个相对于根目录的相对路径 ./)
    let moduleId = './' + path.posix.relative(this.options.context, modulePath);
    let module = {
      id: moduleId,
      dependencies: [],
      name: entryName
    }
    // 再找出模块的依赖 （把转换后的源码转成抽象语法树）
    let ast = parser.parse(targetSourceCode, { sourceType: 'module' });
    traverse(ast, {
      CallExpression: ({ node }) => {
        if (node.callee.name === 'require') {
          // 要引入模块的相对路径
          let moduleName = node.arguments[0].value;
          // 为了获取要加载的模块的绝对路径，第一步要获取当前模块的所在目录
          let dirName = path.posix.dirname(modulePath);
          let depModulePath = path.posix.join(dirName, moduleName);
          let extensions = this.options.resolve.extensions;
          depModulePath = tryExtensions(depModulePath, extensions, moduleName, dirName);
        }
      }
    })
  }

  // 4. 调用Compiler对象的run方法开始执行编译工作 (run方法是开始编译的入口)
  run (callback) {
    // this.hooks.run.call(); 钩子在这里执行的
    console.log('Compiler run：开始真正的编译了');

    // 5. 根据配置中的entry找出入口文件 (配置文件中的entry如果是字符串，就要转成对象(多入口)形式)
    let entry = {};
    if (typeof this.options.entry === 'string') {
      entry.main = this.options.entry;
    } else {
      entry = this.options.entry;
    }

    // 6. 从入口文件触发，调用所有配置的Loader对模块进行编译
    let rootPath = this.options.context || process.cwd();
    for (let entryName in entry) {
      let entryPath = toUnixPath(path.join(rootPath, entry[entryName]));
      let entryModule = this.buildModule(entryName, entryPath);
    }

    // 开始真正的编译了

    // 编译完成最终的回调函数
    const finalCallback = (err, stats) => {
      callback(err, stats)
    };
    const onCompiled = (err, compilation) => {
      console.log('onCompiled');
      finalCallback(err, new Stats(compilation));
      // finalCallback(err, {
      //   entries: [], // 显示所有的入口
      //   chunks: [],  // 显示所有的代码块
      //   module: [],  // 显示所有的模块 [数组]
      //   assets: []   // 显示所有打包后的资源，也就是文件
      // });
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
      // 创建一个新的compilation对象
      const compilation = this.newCompilation(params);
      // 触发make钩子的回调函数执行
      this.hooks.make.callAsync(compilation, err => {
        console.log('make完成');
        onCompiled(null, compilation);
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

/**
 * 
 * @param {*} modulePath 拼出来的模块路径
 * @param {*} extensions 扩展名数组
 * @param {*} originModulePath 原始的模块路径
 * @param {*} moduleContext 模块上下文
 */
function tryExtensions (modulePath, extensions, originModulePath, moduleContext) {
  extensions.unshift(''); // [], .js, .jsx, .josn
  for (let i = 0; i < extensions.length; i++) {
    if (fs.existsSync(modulePath + extensions[i])) {
      return modulePath + extensions[i]
    }
  }
  // 如果到了这句话还是执行到了，说明没有一个后缀能匹配上
  throw new Error(`Module not found: Can't resolve ${originModulePath} in ${moduleContext}`);
}
                                                                                                                                                                                                                                                                                              
module.exports = Compiler;

/**
 * Compiler是单例的，不管编译多少次，Compiler都只有一个
 * 
 * - 第一次，源码改变之后，都会创建新的Compilation
 * - ./src/index.js [Compilation开始编译入口文件，根据入口文件找到所有的依赖文件，封装成一个叫main的代码块chunk]
 * - 根据这个chunk生成一个文件 [main.js 包括入口文件以及所有入口文件依赖模块]
 * 
 * chunk是一个对象
 */