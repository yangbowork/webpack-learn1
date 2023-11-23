function loader(sourceCode) {
}
loader.pitch = function (remainingRequest, previousRequest, data) {
  return `
    let result = require(${ JSON.stringify(this.utils.contextify(this.context, "!!" + remainingRequest)) } )
    if (result && result.__esModule) {
      result = result.default
    }
    if (typeof result === 'string') {
      module.exports = result
    } else {
      module.exports = result.toString()
    }
  `
}

module.exports = loader;
