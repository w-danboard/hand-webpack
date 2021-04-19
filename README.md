### plugin与loader相关

- plugin是贯穿整个生命周期的
- plugin分为注册和触发二个环节
- 刚开始就全部注册了，但这个时候插件函数并没有触发执行
- 而是在执行编译的过程中，逐渐执行的
- loader只是中间小的一个环节

### sourceType: { 'module' } 是什么意思？

> 表示这个源码是一个模块 import export