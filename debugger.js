const webpack = require('./webpack'); // webpack是一个函数，要执行它
const webpackOptions = require('./webpack.config');

const compiler = webpack(webpackOptions);

compiler.run((stats) => {
  console.log(
    stats.toJson()
  )
});