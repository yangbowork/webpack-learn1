const path = require("path");
const RunPlugin = require("./plugins/run-plugin");
const DonePlugin = require("./plugins/done-plugin");
const ReadmePlugin = require("./plugins/readme-plugin");
module.exports = {
  mode: "development",
  // c:\Users\ctzduser41\Desktop\learn-webpack\lesson34
  context: process.cwd(), // 根目录 current working directory
  entry: {
    page1: "./src/page1.js",
    page2: "./src/page2.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  // entry: "./src/index.js",
  // output: {
  //   path: path.resolve(__dirname, "dist"),
  //   filename: "main.js",
  // },
  devtool: "inline-source-map",
  resolve: {
    extensions: ["", ".js", ".jsx", ".json"],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [],
      },
    ],
  },
  plugins: [new RunPlugin(), new DonePlugin(), new ReadmePlugin()],
};
