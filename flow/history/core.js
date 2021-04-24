(function (modules) {
  function require (moduleId) {
    let module = {
      i: moduleId,
      l: false,
      exports: {},
    };
    modules[moduleId].call(module.exports, module, module.exports, require);
    module.l = true;
    return module.exports;
  }
  return require('./src/a/index.js');
})({
  './src/a/index.js': function (module, exports, require) {
    var title = require('./src/title.js');
    console.log(title);
  },
  './src/title.js': function (module, exports) {
    module.exports = 'title';
  }
});