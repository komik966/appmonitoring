const path = require("path");

module.exports = function (env) {
  return {
    mode: env.production ? "production" : "development",
    entry: "./src/client/index.tsx",
    devtool: env.production ? "source-map" : "cheap-module-source-map",
    output: {
      filename: "index.js",
      path: path.resolve(__dirname, "dist/client"),
    },
    module: {
      rules: [{ use: { loader: "babel-loader" } }],
    },
    resolve: {
      extensions: [".js", ".jsx", ".ts", ".tsx"],
    },
  };
};
