function loader(sourceCode) {
  console.log(123321);
  console.log(123321);
  return `module.exports = ${JSON.stringify(sourceCode)}`;
}

module.exports = loader;
