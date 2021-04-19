const webpack = require('./webpack'); // webpack是一个函数，要执行它
const webpackOptions = require('./webpack.config');

const compiler = webpack(webpackOptions);

compiler.run((err, stats) => {
  console.log(err)
  console.log(
    stats.toJson({
      entries: true,
      chunks: true,
      modules: true,
      assets: true
    })
  )
});