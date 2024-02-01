/**
 * 先获取到style样式，然后创建一个style标签，并插入到页面中
 * 什么时候会用到pitch loader
 * 当你想把两个最左侧的loader并联使用的时候
 */
function normal(inputSource) { }
normal.pitch = function (remainingRequest, previousRequest, data) {
  // 剩下的loader!要加载的路径
  // !!只要行内样式
  // !./loaders/css-loader.js!./src/indexedDB.css
  let style = `
        let style = document.createElement('style')
        style.innerHTML = require(
          ${JSON.stringify(this.utils.contextify(this.context, "!!" + remainingRequest))}
        )
        document.head.appendChild(style)
    `;
  return style;
};
module.exports = normal;
