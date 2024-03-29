const path = require("path");

module.exports = {
  context: process.cwd(),
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    chunkFilename: "[name].js",
  },
  devtool: false,
};
