"use strict";

const TerserPlugin = require("terser-webpack-plugin");
const nodeExternals = require("webpack-node-externals");
const slsw = require("serverless-webpack");
const path = require("path");

module.exports = {
  entry: slsw.lib.entries,
  mode: slsw.lib.webpack.isLocal ? "development" : "production",
  target: "node",
  externals: [nodeExternals(), "pg", "sqlite3", "tedious", "pg-hstore"],
  output: {
    libraryTarget: "commonjs",
    path: path.resolve(__dirname + ".webpack/" + Date.now() + ".webpack"), // Date.now allows to run multiple serverless-offline processes in parralel
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
