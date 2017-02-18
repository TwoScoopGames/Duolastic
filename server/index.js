var server = require("http").createServer();

var createMatchMakingServer = require("./create-match-making-server");
createMatchMakingServer(server);

var express = require("express");
var app = express();
app.use(express.static("../build/html"));
server.on("request", app);

var port = 4001;
server.listen(port, function() {
  console.log("Listening on", server.address().port);
});
