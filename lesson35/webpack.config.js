const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
  },
  module: {
    rule: [
      {
        test: /\.js$/,
        use: ["normal-loader1", "normal-loader1"],
      },
      {
        test: /\.js$/,
        enforce: "post", // post webpack保证一定是后执行的
        use: ["post-loader1", "post-loader2"],
      },
      {
        test: /\.js$/,
        enforce: "pre", // pre webpack保证一定是先执行的
        use: ["pre-loader1", "pre-loader2"],
      },
    ],
  },
};
