class RunPlugin {
  // 每个插件都要有个apply方法 (定死的)
  apply (compiler) {
    // 挂载阶段
    // 注册run这个钩子 (当触发这个run钩子执行的时候，会触发这个回调)
    compiler.hooks.run.tap('RunPlugin', () => {
      // 执行阶段
      console.log('挂载RunPlugin');
    });
  }
}

module.exports = RunPlugin;

/**
 * 所有的事件库都是发布订阅的
 *  tap的时候注册
 *  call的时候执行
 */
