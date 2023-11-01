function loader(source) {
  console.log("inline2");
  return source + "//inline2";
}
loader.pitch = () => {
  console.log("inline2-pitch");
};

module.exports = loader;
