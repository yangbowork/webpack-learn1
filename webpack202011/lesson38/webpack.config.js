const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
  },
  devtool: "inline-source-map",
  module: {
    rules: [
      // {
      //   test: /\.js$/,
      //   use: [path.resolve(__dirname, "./loaders/babel-loader.js")],
      //   include: path.resolve("src"),
      // },
      // {
      //   test: /\.(png|jpg|gif)$/,
      //   use: {
      //     loader: path.resolve(__dirname, "./loaders/file-loader.js"),
      //     // loader: "file-loader",
      //     options: {
      //       name: "[hash:8].[ext]",
      //       // esModule: false,
      //     },
      //   },
      // },
      {
        test: /\.(png|jpg|gif)$/,
        type: "asset",
        generator: {
          filename: "[hash:8].[ext]",
        },
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024,
          },
        },
      },
      // {
      //   test: /\.(png|jpg|gif)$/,
      //   use: {
      //     loader: path.resolve(__dirname, "./loaders/url-loader.js"),
      //     options: {
      //       name: "[hash:8].[ext]",
      //       limit: 8 * 1024,
      //       fallback: path.resolve(__dirname, "./loaders/file-loader.js")
      //     },
      //   },
      // },
      {
        test: /\.less$/,
        use: [
          path.resolve(__dirname, "./loaders/style-loader.js"),
          path.resolve(__dirname, "./loaders/less-loader.js"),
        ],
      },
    ],
  },
  plugins: [new HtmlWebpackPlugin(), new CleanWebpackPlugin()],
};
