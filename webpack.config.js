const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: resolve(__dirname, "dist"),
    filename: "bundle.js",
    environment: {
      // ...
      arrowFunction: false, // <-- this line does the trick
    },
  },
  devtool: "source-map",
  devServer: {
    static: {
      directory: resolve(__dirname, "static"),
    },
    compress: true,
    port: 8080,
    open: true,
  },
  module: {
    rules: [
      // {
      //   test: /\.jsx?$/,
      //   use:
      //   exclude: /node_modules/
      // },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "less-loader"],
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(png|jp?eg|svg)$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 0.5 * 1024,
          },
        },
        generator: {
          filename: "static/[hash:8][ext][query]",
        },
      },
      {
        test: /\.html$/,
        use: "html-loader",
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
