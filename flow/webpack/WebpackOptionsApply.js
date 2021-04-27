const EntryOptionPlugin = require('./EntryOptionPlugin');

class WebpackOptionsApply {
  process (options, compiler) {
    new EntryOptionPlugin().apply(compiler); // 订阅这个钩子
    compiler.hooks.entryOption.call(options.context, options.entry); // 触发这个钩子
  }
}

module.exports = WebpackOptionsApply;