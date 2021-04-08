let Compiler = require('./Compiler');
const NodeEnvironmentPlugin = require('./node/NodeEnvironmentPlugin');
const WebpackOptionsApply = require('./WebpackOptionsApply');
const webpack = (options, callback) => {
  let compiler = new Compiler(options); // 创建一个Compiler的实例
  compiler.options = options; // 给他赋予一个options属性
  new NodeEnvironmentPlugin().apply(compiler); // 让compiler可以读文件和写文件了
  // 挂载配置文件里提供的所有的plugins
  if (options.plugins && Array.isArray(options.plugins)) {
    for (const plugin of options.plugins) {
      plugin.apply(compiler);
    }
  }
  new WebpackOptionsApply().process(options, compiler);
  return compiler;
};

exports = module.exports = webpack;