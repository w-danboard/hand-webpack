const path = require('path');
const { Tapable, SyncHook } = require('tapable');
const NormalModuleFactory = require('./NormalModuleFactory');
const normalModuleFactory = new NormalModuleFactory();

const Parser = require('./Parser');
let parser = new Parser();
class Compilation extends Tapable {
  constructor (compiler) {
    super();
    this.compiler = compiler; // 编译器对象
    this.options = compiler.options; // 选项一样
    this.context = compiler.context; // 根目录
    /**
     * 为啥不是直接在这个文件引入fs直接使用 而是利用inputFileSystem呢？
     * 答：为了灵活，可配置。因为在热更新的时候，读文件写文件用的是(迈瑞fs。。。)
     */
    this.inputFileSystem = compiler.inputFileSystem; // 读取文件模块fs
    this.outputFileSystem = compiler.outputFileSystem; // 写入文件的模块fs
    this.entries = []; // 入口的数组， 这里放着所有的入口模块
    this.modules = []; // 模块的数组， 这里放着所有的模块
    this.hooks = {
      // 当你成功构建完成一个模块后就会触发此钩子
      succeedModule: new SyncHook(['module'])
    }
  }

  /**
   * 开始编译一个新的入口
   * @param {*} context 根目录
   * @param {*} entry 入口模块的相对路径 ./src/index.js
   * @param {*} name 入口的名字 main
   * @param {*} callback 编译完成的回调
   */
  addEntry (context, entry, name, finalCallback) {
    this._addModuleChain(context, entry, name, (err, module) => {
      finalCallback(err, module);
    });
  }

  _addModuleChain (context, rawRequest, name, callback) {
    // 通过模块工厂 创建一个模块
    let entryModule = normalModuleFactory.create({
      name, // 入口名字 main
      context, // 根目录 // TODO
      rawRequest, // ./src/index.js
      resource: path.posix.join(context, entry), // 入口的绝对路径
      parser
    });
    this.entries.push(entryModule); // 给入口模块数组添加一个模块
    this.modules.push(entryModule); // 给普通模块数组添加一个模块
    const afterBuild = (err) => {
      // TODO 编译依赖的模块
      return callback(null, module)
    }
    this.buildModule(entryModule, afterBuild);
  }

  /**
   * 编译模块
   * @param {*} module 要编译的模块
   * @param {*} afterBuild 编译完成后的回调
   */
  buildModule (module, afterBuild) {
    /**
     * 模块的真正编译逻辑其实是放在module内部完成
     *  模块是这么编译的？
     *  1.先去读取源文件
     *  2.读完之后，走loader配置
     *  3.走完之后得到js模块，把js模块转为语法树
     *  4.最后去编译依赖？？？
     */
    // 会调用模块自己的build方法
    module.build(this, err => {
      // 走到这里意味着一个module模块已经编译完成了
      this.hooks.succeedModule.call(module);
      afterBuild(err)
    })
  }
}

module.exports = Compilation;