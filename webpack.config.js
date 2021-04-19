const path = require('path');
const RunPlugin = require('./plugins/run-plugin');
const DonePlugin = require('./plugins/done-plugin');
module.exports = {
  context: process.cwd(), // 当前工作目录
  mode: 'development',
  devtool: false,
  // entry: './src/index.js', 这样写类似于语法糖，最终要转成下面对象形式
  entry: {
    main: './src/index.js'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          path.resolve(__dirname, 'loaders', 'logger1-loader.js'), // loader的绝对路径
          path.resolve(__dirname, 'loaders', 'logger2-loader.js')
        ]
      }
    ]
  }, 
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  },
  plugins: [
    new RunPlugin(),
    new DonePlugin()
  ]
}