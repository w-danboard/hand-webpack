const webpack = require('./webpack');
const webpackOptions = require('./webpack.config');

const compiler = webpack(webpackOptions);

compiler.run((err, stats) => {
  console.log(err)
  console.log(
    stats.toJSON({
      entries: true,
      chunks: true,
      modules: true,
      assets: true,
    })
  )
});