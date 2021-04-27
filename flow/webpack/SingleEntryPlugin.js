class SingleEntryPlugin {
  /**
   * 
   * @param {*} context 根目录 /Users/wanglin/Desktop/webpack-not-del/hand-webpack/flow
   * @param {*} entry 入口路径 ./src/index.js
   * @param {*} name 入口的名称 main
   */
  constructor (context, entry, name) {
    this.context = context;
    this.entry = entry;
    this.name = name;
  }

  apply (compiler) {
    // 监听make事件
    compiler.hooks.make.tapAsync('SingleEntryPlugin', (compilation, callback) => {
      console.log('开始真正的编译入口', this.entry);
      // 开始真正的编译入口
      // compilation.addEntry(this.context, this.entry, this.name,  callback);
    });
  }
};

module.exports = SingleEntryPlugin;