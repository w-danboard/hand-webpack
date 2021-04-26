(function (modules) {
  // 已经安装过的代码块ID 0已加载成功
  let installedChunks = {
    main: 0, // 等于0就是加载完了呗？
  };

  function webpackJsonpCallback(data) {
    let [chunkIds, moreModules] = data;
    let resolves = [];
    for (let i = 0; i < chunkIds.length; i++) {
      let chunkId = chunkIds[i]; // title
      let installedChunkData = installedChunks[chunkId]; // [resolve reject promise]
      let resolve = installedChunkData[0];
      resolves.push(resolve); // 把promise的resolve方法放到resolves数组中
      // 只要说此代码块的代码已经加载回来了 那就是成功了
      installedChunks[chunkId] = 0; // 标志这个代码块已经加载成功了
    }
    // 把异步加载过来的代码块里面的模块合并到modules中
    for (let moduleId in moreModules) {
      modules[moduleId] = moreModules[moduleId];
    }
    // resolves.forEach(resolve => resolve());
    resolves.forEach(resolve => {
      resolve()
    }); // resolve一旦执行就意味着它对应的promise变成了成功态
  }

  // require方法
  function require (moduleId) {
    let module = {
      i: moduleId,
      exports: {}
    };
    modules[moduleId](module, module.exports, require);
    return module.exports;
  };

  require.e = function (chunkId) {
    let promise = [];
    let installedChunkData = installedChunks[chunkId];
    if (installedChunkData != 0) { // 说明没加载成功
      if (installedChunkData) { // 加载中了
        // [resolve reject promise]
        promise.push(installedChunkData[2]);
      } else {
        let promise = new Promise(function (resolve, reject) {
          installedChunkData = [resolve, reject];
        });
        installedChunkData[2] = promise;
        // installedChunkData.push(promise); // [resolve reject promise]
        installedChunks[chunkId] = installedChunkData;
        let script = document.createElement('script');
        script.src = chunkId + '.js';
        document.head.appendChild(script);
      }
    }
    return Promise.all(promise); // 防止重复加载，如果调用两次就可以复用上次的 不需要重新加载
  };
  require.t = function (value, mode) {
    // mode=7 0b0111
    if (mode & 0b0001) { // 如果为ture, 说明这个value是一个模块ID，需要require加载
      value = require(value);
    }
    // 下面的逻辑是把一个不管是common.js还是es6模块都变成一个es6模块
    let ns = Object.create(null);
    ns.__esModule = true;
    ns.default = value; // ns.default指向原来的导出对象
    for (let key in value) { // 把value上的属性全部合并到ns对象上
      // 把value上的属性全部合并到ns对象上, 为了取值方便，不需要ns.default.xxx 直接ns.xxx就可以
      ns[key] = value[key];
    }
    // Object.assign(ns, value);
    return ns;
  };
  /**
   * 为什么搞数组
   * 是为了把data缓存在内部 [data, data]
   */
  window['webpackJsonp'] = [];
  let jsonArray = window['webpackJsonp'];
  jsonArray.push = webpackJsonpCallback;

  return require('./src/index.js');
})({
  './src/index.js': function (module, exports, require) {
    let importBtn = document.getElementById('import');
    importBtn.addEventListener('click', () => {
      require
        .e('title')
        .then(function () {
          return require.t('./src/title.js', 7);
        })
        .then((result) => {
          console.log(result);
        });
    });
  },
});