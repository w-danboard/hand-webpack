const SingleEntryPlugin = require("./SingleEntryPlugin");

class EntryOptionPlugin {
  apply (compiler) {
    // 当有一个entryOption事件触发的时候，会执行回调，并传人context和entry
    compiler.hooks.entryOption.tap('EntryOptionPlugin', (context, entry) => {
      // 创建SingleEntryPlugin
      new SingleEntryPlugin(context, entry, 'main').apply(compiler);
    });
  }
}

module.exports = EntryOptionPlugin;