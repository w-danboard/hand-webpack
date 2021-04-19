/**
 * 统一路径分隔符
 * \换成/
 * window路径分隔符 \
 * mac linux 路径分隔符 /
 * @param {*} filePath 
 * @returns 
 */
function toUnixPath (filePath) {
  return filePath.replace(/\\/g, '/');
}

exports.toUnixPath = toUnixPath;