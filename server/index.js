var server = require("http").createServer();
var url = require("url");
var WebSocketServer = require("ws").Server;

var wss = new WebSocketServer({ server: server });

var express = require("express");
var app = express();
var port = 4001;

app.use(express.static("../build/html"));

var waiting;

wss.on("connection", function(ws) {
  if (!waiting) {
    waiting = ws;
    waiting.on("close", function() {
      if (this === waiting) {
        waiting = undefined;
      }
    });
    return;
  }

  var clientA = ws;
  var clientB = waiting;
  waiting = undefined;

  clientA.on("message", function(message) {
    // console.log("received:", message);
    clientB.send(message);
  });
  clientB.on("message", function(message) {
    // console.log("received:", message);
    clientA.send(message);
  });

  clientA.send("initiate");
});

server.on("request", app);
server.listen(port, function() {
  console.log("Listening on", server.address().port);
});
