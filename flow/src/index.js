let importBtn = document.getElementById('import');
importBtn.addEventListener('click', () => {
  // result就是这个title模块的导出对象
  import(/* webpackChunkName: 'title' */ './title').then(result => {
    console.log(result)
  })
})


// import('./title')

// __webpack_require__.e('title').then(__webpack_require__.t.bind(null, './src/title.js', 7)).then((result) => {
//   console.log(result);
// });