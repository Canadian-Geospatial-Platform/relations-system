const TerserPlugin = require("terser-webpack-plugin");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  entry: "./handler.js",
  target: "node",
  externals: [nodeExternals(), "pg", "sqlite3", "tedious", "pg-hstore"],
  output: {
    libraryTarget: "commonjs",
    path: __dirname + ".webpack",
    filename: "handler.js" // this should match the first part of function handler in serverless.yml
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          keep_fnames: true
        }
      })
    ]
  }
};
