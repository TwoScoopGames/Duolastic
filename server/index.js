var createMatchMakingServer = require("./create-match-making-server");
var express = require("express");
var http = require("http");
var setupWebpackDevMiddleware = require("./setup-webpack-dev-middleware");

var server = http.createServer();

createMatchMakingServer(server);

var app = express();
setupWebpackDevMiddleware(app);
// FIXME: maybe only do this when webpack-dev-middleware isn't being used
app.use(express.static("../build/html"));
server.on("request", app);

var port = 4001;
server.listen(port, function() {
  console.log("Listening on", server.address().port);
});
