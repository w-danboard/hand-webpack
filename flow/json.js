let stats = {
  errors: [], // 报错信息
  warnings: [], // 警告信息
  version: '4.41.4',  // webpack版本号
  hash: '4f2d5e2b2003c172ce61', // 本次编译的哈希值
  time: 84, // 编译花的时间
  builtAt: 1619446349273, // 编译时候的时间戳
  publicPath: '', // 公开访问路径 打包后在被引入页面的时候会以什么开头
  outputPath: '/Users/wanglin/Desktop/webpack-not-del/hand-webpack/flow/dist', // 输出目录
  assetsByChunkName: { main: 'main.js' }, // key是chunk名称 value是对应的文件
  // 产出了哪些文件
  assets: [
    {
      name: 'main.js',
      size: 4125,
      chunks: [Array],
      chunkNames: [Array],
      // info: {},
      emitted: true, // 是否写入硬盘了
      isOverSizeLimit: undefined
    }
  ],
  // filteredAssets: 0, 过滤的资源
  // 入口点
  entrypoints: {
    main: {
      chunks: [Array], // main
      assets: [Array], // main.js
      // children: [Object: null prototype] {},
      // childAssets: [Object: null prototype] {},
      // isOverSizeLimit: undefined
    }
  },
  // 在webpack4里，多了一个概念chunkGroup, 是用来进行代码的分割或合并的
  // spitChunks会用到
  namedChunkGroups: {
    main: { // chunkGroup main
      chunks: [Array], // main
      assets: [Array], // main
      // children: [Object: null prototype] {},
      // childAssets: [Object: null prototype] {},
      // isOverSizeLimit: undefined
    }
  },
  chunks: [
    {
      id: 'main', // chunkId
      rendered: true, // 是否已经渲染
      initial: true, // 是否初始化模块 import懒加载
      entry: true, // 是否是入口代码块
      // recorded: undefined,
      // reason: undefined,
      size: 76,
      names: [Array],
      files: [Array],
      hash: 'e71fd935019d18eb2f2d', // chunkHash 每个代码块有自己的hash值
      siblings: [], // 子代码块
      parents: [], // 父代码块
      children: [], // 子代码块
      // childrenByOrder: [Object: null prototype] {},
      modules: [Array], // 这个代码块包含哪些模块
      // filteredModules: 0,
      // origins: [Array]
    }
  ],
  modules: [
    {
      id: './src/index.js', // 模块ID
      identifier: '/Users/wanglin/Desktop/webpack-not-del/hand-webpack/flow/src/index.js', // 子模块打包前的绝对路径
      name: './src/index.js',
      index: 0, // 是从0开始
      index2: 1,  // 从1开始
      size: 51,
      cacheable: true, // 是否缓存
      built: true,
      optional: false,
      prefetched: false, // 是否要预获取 prefetched和preloaded不一样
      chunks: [Array], // module和chunk是多对多的关系，一个模块可能会包含在多个代码块中，一个代码块可能包含多个模块
      // issuer: null,
      // issuerId: null,
      // issuerName: null,
      // issuerPath: null,
      // profile: undefined,
      failed: false,
      errors: 0,
      warnings: 0,
      assets: [],
      reasons: [Array], // 由于什么原因此模块被打包进来 说白了就是谁依赖它了
      providedExports: null,
      optimizationBailout: [],
      depth: 0, // 深度 相当于辈分  比如入口模块的辈分是0 儿子1 孙子2
      source: "let title = require('./title');\nconsole.log(title);" // 源代码
    },
    {
      id: './src/title.js',
      identifier: '/Users/wanglin/Desktop/webpack-not-del/hand-webpack/flow/src/title.js',
      name: './src/title.js',
      index: 1,
      index2: 0,
      size: 25,
      cacheable: true,
      built: true,
      optional: false,
      prefetched: false,
      chunks: [Array],
      issuer: '/Users/wanglin/Desktop/webpack-not-del/hand-webpack/flow/src/index.js', // 哪个模块依赖我这个模块，，导致我被打包进来了。这个房的是主模块的绝对路径
      issuerId: './src/index.js',
      issuerName: './src/index.js',
      issuerPath: [Array],
      profile: undefined,
      failed: false,
      errors: 0,
      warnings: 0,
      assets: [],
      reasons: [Array], // 原因 index.js
      providedExports: null,
      optimizationBailout: [],
      depth: 1,
      source: "module.exports = 'title';"
    }
  ],
  filteredModules: 0,
  logging: {
    'webpack.buildChunkGraph.visitModules': { entries: [], filteredEntries: 2, debug: false }
  },
  children: []
}

// hash的生成是有规则的