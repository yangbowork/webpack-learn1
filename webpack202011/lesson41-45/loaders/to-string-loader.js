function loader(sourceCode) {
  return `module.exports = ${JSON.stringify(sourceCode)}`;
}

module.exports = loader;
