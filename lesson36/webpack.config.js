const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
/**
 *  自定义使用loader的三种方法
 *  1.alias //alias: { "babel-loader": path.resolve(__dirname, "./loaders/babel-loader.js") },
 *  2.modules //  modules: [path.resolve(__dirname, "loaders"), "node_modules"],
 *  3.绝对路径  // use: [path.resolve(__dirname, "./loaders/babel-loader.js")],
 */
module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
  },
  devtool: "inline-source-map",
  resolveLoader: {
    alias: {
      "babel-loader": path.resolve(__dirname, "./loaders/babel-loader.js"),
    },
    // modules: [path.resolve(__dirname, "loaders"), "node_modules"],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ["babel-loader"],
        include: path.resolve("src"),
        // use: [path.resolve(__dirname, "./loaders/babel-loader.js")],
      },
    ],
  },
  plugins: [new HtmlWebpackPlugin()],
};
