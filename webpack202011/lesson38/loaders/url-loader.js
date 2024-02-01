const mime = require("mime");
const { getOptions } = require("loader-utils");

function loader(content) {
  // content默认格式是字符串
  const options = getOptions(this) || {};
  const { limit = 8 * 1024, fallback = "file-loader" } = options;
  const fileType = mime.getType(this.resourcePath); // image/jpeg
  if (content.length < limit) {
    let base64Str = `data:${fileType};base64,${content.toString("base64")}`;
    return `
    "use strict";
    module.exports = ${JSON.stringify(base64Str)}`;
  } else {
    let fileLoader = require(fallback);
    return fileLoader.call(this, content);
  }
}

//如果你不希望webpack帮你把内容转成字符串的话，loader-raw=true；这样的话content就是一个二进制的Buffer
loader.raw = true;

module.exports = loader;
