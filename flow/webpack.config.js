const path = require('path'); // 处理路径的
const test = require('./test');

// 自动生成HTML文件的
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development', // development不压缩代码 production会进行压缩
  devtool: 'none', // 不需开发的source-map文件
  entry: './src/index.js', // 入口模块
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  // module: {
  //   rules: [
  //     {
  //       test: /\.(png|jpg|gif)$/,
  //       use: [
  //         {
  //           loader: 'file-loader',
  //           options: {
  //             name: '[name].[ext]',
  //             outputPath: './img'
  //           }
  //         }
  //       ]
  //     }
  //   ]
  // },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    // new test({
    //   staticDir: path.join(__dirname, 'dist/img'),
    //   fileName: '2.png',
    //   target: path.resolve(__dirname, 'dist')
    // })
  ]
}