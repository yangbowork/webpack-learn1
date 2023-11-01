function loader(source) {
  console.log("inline1");
  return source + "//inline1";
}
loader.pitch = () => {
  console.log("inline1-pitch");
};

module.exports = loader;
