const path = require('path');

module.exports = {
  mode: 'development',
  devtool: false,
  // MPA多页应用，多入口
  entry: {
    page1: './src/page1.js',
    page2: './src/page2.js',
    page3: './src/page3.js'
  },
  // 配置如何优化
  optimization: {
    // 设置代码块的分割方案
    splitChunks: {
      chunks: 'all', // 在这配置相当于vendors和commons里都配置了
      // 要分割哪些diamante块 all = 同步 + 异步 / initial = 是同步 (require import xx) / async = 异步 (import('yy'))
      // chunks: 'all', // 默认是async 异步
      minSize: 0, // 被提取代码块的最小尺寸 (默认值为30k，如果小于等于此值的话，则不提取)
      // page1~page2
      automaticNameDelimiter: '~', // 默认以~分隔
      maxAsyncRequests: 5,  // 同一个入口分割出来的最大异步请求数
      maxInitialRequests: 3, // 同一个入口分割出来的最大同步请求数
      name: true, // 设置代码块打包后的名称，默认名称是用分隔符~分隔开的原始代码
      // 缓存组 设置不同的缓存组来抽取满足不同规则的chunk (非常重要 一定要有)
      // webpack里还有一些默认缓存组，它的优先级是0
      cacheGroups: {
        // 第三方
        vendors: { // 把符合条件的缓存组提取出来在vendor这个代码块里
           chunks: 'all',
           test: /[\\/]node_modules[\\/]/, // 模块路径有node_modules的话就放到vendors里
           // 如果一个模块符合多个缓存组的条件
           priority: -10, // 数字越大，优先级越高
        },
        // 提供不同的代码块之间的公共代码
        // commons~page1~page2.js
        commons: {
          chunks: 'all',
          minChunks: 2, // 如果这个模块被2个或2个以上的代码块引用了，就可以单独提取出来
          // minSize: 0, // 被提取的代码块的大小，默认是30k
          priority: -20,
          // reuseExistingChunk: true
        }
      }
    }
  }
}