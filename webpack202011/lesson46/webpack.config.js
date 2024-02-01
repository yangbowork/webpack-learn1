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
  devtool: false,
  resolveLoader: {
    alias: {
      "css-loader": path.resolve(__dirname, "loaders", "css-loader"),
    },
    // modules: [path.resolve(__dirname, "loaders"), "node_modules"],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          "to-string-loader",
          {
            loader: "css-loader",
            options: {
              url: true, // 是否解析url()
              import: true, // 是否解析@import语法
              esModule: false, // 不包装成ES MODULE，默认common.js导出
              importLoaders: 0, // 在处理导入的CSS的时候，要经过几个前置loader的处理
            },
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          "to-string-loader",
          {
            loader: "css-loader",
            options: {
              url: true, // 是否解析url()
              import: true, // 是否解析@import语法
              esModule: false, // 不包装成ES MODULE，默认common.js导出
              importLoaders: 1, // 在处理导入的CSS的时候，要经过几个前置loader的处理
            },
          },
          "less-loader",
        ],
      },
      {
        test: /\.(png|jpg|gif)$/,
        // type: "asset",
        use: [
          {
            loader: "file-loader",
            options: {
              esModule: false,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
    new CleanWebpackPlugin(),
  ],
};
