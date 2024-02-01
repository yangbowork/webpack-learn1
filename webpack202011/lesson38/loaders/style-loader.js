/**
 * 把CSS变成一个JS脚本
 * 脚本就是动态创建一个style标签，并且把这个style标签插入到HTML的header里
 * @param {*} content 
 * @returns 
 */
function loader(content) {
  return `
    const style = document.createElement('style')
    style.innerHTML = ${JSON.stringify(content)}
    document.head.appendChild(style)
  `;
}
module.exports = loader;
