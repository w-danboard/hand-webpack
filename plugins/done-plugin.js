class DonePlugin {
  // 每个插件都要有个apply方法 (定死的)
  apply (compiler) {
    // 注册done这个钩子 (当触发这个run钩子执行的时候，会触发这个回调)
    compiler.hooks.run.tap('DonePlugin', () => {
      console.log('挂载DonePlugin');
    });
  }
}

module.exports = DonePlugin;