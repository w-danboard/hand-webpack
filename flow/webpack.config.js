const path = require('path');

module.exports = {
  context: process.cwd(), // 当前工作目录
  mode: 'development',
  devtool: false,
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[hash].[chunkHash].js',
    publicPath: '/' // 公开访问路径
  },
  plugins: [
    
  ]
}