const path = require('path');
let async = require('neo-async'); 
const { Tapable, SyncHook } = require('tapable');
const NormalModuleFactory = require('./NormalModuleFactory');
const normalModuleFactory = new NormalModuleFactory();

// 所有模块共享一个Parser
const Parser = require('./Parser');
let parser = new Parser();
// console.log(parser, '===>')
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
    this._modules = {}; // key模块ID， 值是模块的模块对象(源代码)
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
    this.createModule({
      name,
      context,
      rawRequest,
      parser,
      resource: path.posix.join(context, rawRequest)
    }, entryModule => this.entries.push(entryModule), callback);
  }

  // 源码里写两遍 我们为了简化就写一遍
  /**
   * 创建并编译一个模块
   * @param {*} data 要编译的模块信息
   * @param {*} addEntry 可选的增加入口的方法 如果是就添加到入口模块，如果不是的话就是吗都不做
   * @param {*} callback 编译完成之后，可以调用callback回调
   */
  createModule (data, addEntry, callback) {
    // 通过模块工厂 创建一个模块
    // let entryModule = normalModuleFactory.create({
    //   name, // 入口名字 main
    //   context, // 根目录 // TODO
    //   rawRequest, // ./src/index.js
    //   resource: path.posix.join(context, rawRequest), // 入口的绝对路径
    //   parser
    // });
    let module = normalModuleFactory.create(data);
    module.moduleId = './' + path.posix.relative(this.context, module.resource); // ./src/index.js
    addEntry && addEntry(module) // 如果是入口模块，则添加到入口里去
    this._modules[module.moduleId] = module; // 保存一下对应信息
    this.entries.push(module); // 给入口模块数组添加一个模块
    this.modules.push(module); // 给普通模块数组添加一个模块
    
    const afterBuild = (err, module) => {
      // 编译依赖的模块
      // 如果大于0，说明有依赖
      if (module.dependencies.length > 0) {
        this.processModuleDependencies(module, err => {
          callback(err, module);
        });
      } else {
        callback(err, module);
      }
      // return callback(null, module)
    }
    this.buildModule(module, afterBuild);
  }

  /**
   * 处理编译模块依赖
   * @param {*} module ./src/index.js
   * @param {*} callback 所有模块都处理完之后才调用callback，也就是依赖都编译完才调callback
   */
  processModuleDependencies (module, callback) {
    // 1.获取当前模块的依赖模块
    let dependencies = module.dependencies;
    // 遍历依赖模块，全部开始编译，当所有的依赖模块全部编译完成后才调callback函数
    async.forEach(dependencies, (dependency, done) => {
      let { name, context, rawRequest, resource, moduleId } = dependency;
      this.createModule({
        name,
        context,
        rawRequest,
        parser,
        resource,
        moduleId
      }, null, done);
    }, callback)
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
      afterBuild(err, module);
    })
  }
}

module.exports = Compilation;