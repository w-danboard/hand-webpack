const Compiler = require('./Compiler'); // 编译器对象
const NodeEnvironmentPlugin = require('./node/NodeEnvironmentPlugin');
const WebpackOptionsApply = require('./WebpackOptionsApply');

/**
 * 
 * @param {*} options 选项 
 * @param {*} callback 回调函数
 * @returns 编译器对象
 */
const webpack = (options, callback) => {
  /**
   * 源码中的步骤 这里没有写
   *  第一步验验证配置文件是否合法 如果不合法报错
   *  第二步增加默认参数，因为webpack是零配置
   */
  // 1. 初始化参数，从配置文件和Shell语句中读取并合并参数，得出最终的配置对象
  let shellOptions = process.argv.slice(2).reduce((config, args) => {
    let [key, value] = args.split('=');
    config[key.slice(2)] = value;
    return config;
  }, {});
  // 合拼配置参数
  options = { ...options, ...shellOptions };

  // 2. 用上一步得到的参数初始化Compiler对象
  let compiler = new Compiler(options); // 创建一个Compiler的实例
  new NodeEnvironmentPlugin().apply(compiler); // 让compiler可以读文件和写文件了
  // 3. 加载所有配置的插件 (挂载配置文件里提供的所有的plugins)
  if (options.plugins && Array.isArray(options.plugins)) {
    for (const plugin of options.plugins) {
      plugin.apply(compiler);
    }
  }
  // 初始化选项，挂载内置插件
  new WebpackOptionsApply().process(options, compiler);
  return compiler;
};

exports = module.exports = webpack;