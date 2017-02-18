var express = require("express");
var fs = require("fs");
var path = require("path");
var webpack = require("webpack");
var webpackMiddleware = require("webpack-dev-middleware");

var wdmConfig = {
  publicPath: "/",
  index: "index.html",
  stats: {
    colors: true
  },
};

module.exports = function setupWebpackDevMiddleware(app) {
  var environment = process.env["NODE_ENV"] || "development";
  if (environment !== "development") {
    return;
  }

  app.get("/", function(req, res) {
    fs.createReadStream(path.join(__dirname, "../src/index.html"), { encoding: "utf8" }).pipe(res);
  });
  app.use("/fonts/", express.static(path.join(__dirname, "../src/fonts")));
  app.use("/images/", express.static(path.join(__dirname, "../src/images")));
  app.use("/sounds/", express.static(path.join(__dirname, "../src/sounds")));

  var config = require("../webpack.config.js");
  config.entry.index.push("webpack-hot-middleware/client?reload=true");
  config.plugins.push(
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  );

  var compiler = webpack(config);
  app.use(webpackMiddleware(compiler, wdmConfig));
  app.use(require("webpack-hot-middleware")(compiler));
}
