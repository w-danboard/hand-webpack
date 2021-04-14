class NormalModule {
  constructor ({ name, context, rawRequest, resource, parser }) {
    this.name = name;
    this.context = context; // 跟目录
    this.rawRequest = rawRequest; // src/index.js 
    this.resource = resource; // 这是这个模块的绝对路径 [相当于context + resource]
    // 这是AST解析器，可以把源代码转成AST抽象语法树
    this.parser = parser;
    // 此模块对应的源代码
    this._source; 
    // 此模块对应的AST抽象语法树
    this._ast; 
  }

  /**
   * 编译本模块
   *  1. 先从硬盘上把模块内容读出来，读成一个文本
   *  2. 可能它不是一个js模块，所以会可能要走loader的转换，最终肯定要跌到一个js模块，如果得不到就报错了
   *  3. 把这个js模块代码经过parser的处理转成一个抽象语法树AST
   *  4. 分析AST里面的依赖，也就是找require,import节点，分析语法树
   *  5. 递归的编译依赖的模块
   *  6. 不停的依次递归执行上面5步，知道所有的模块都编译完成为止
   * @param {*} compilation 
   * @param {*} callback 
   */
  build (compilation, callback) {
    this.doBuild(compilation, err => {
      this._ast = this.parser.parser(this._source);
      callback();
    })
  }
  
  /**
   * 1. 读取模块的源代码
   * @param {*} compilation 
   * @param {*} callback 
   */
  doBuild (compilation, callback) {
    this.getSource(compilation, (err, source) => {
      // 把最原始的代码存放到当前模块的_source属性上
      this._source = source; // TODO
      callback();
    });
  }
  /**
   * 读取真正的源代码
   */
  getSource (compilation, callback) {
    compilation.inputFileSystem.readFile(this.resource, 'utf8', callback)
  }
}

module.exports = NormalModule;