var createPeerConnection = require("../../peer");
var deserialize = require("../../serialize").deserialize;
var serialize = require("../../serialize").serialize;

var peer;
var incomingMessages = [];

createPeerConnection(function(err, p) {
  if (err) {
    console.error(err);
    return;
  }
  peer = p;
  console.log("got a peer", peer);
  peer.on("data", function(data) {
    // console.log("got data", JSON.parse(data.toString()));
    incomingMessages.push(JSON.parse(data.toString()));
  });
});

var PACKET_RATE = 50;

module.exports = function(ecs, game) { // eslint-disable-line no-unused-vars
  ecs.addEach(function(entity, elapsed) { // eslint-disable-line no-unused-vars
    if (!peer) {
      return;
    }
    if (peer.initiator) {
      handleServer(game, entity, elapsed);
    } else {
      handleClient(game, entity, elapsed);
    }
  }, "network");
};

var player1 = 2;
var player2 = 3;
var ball = 4;

function handleServer(game, entity, elapsed) {
  game.entities.addComponent(player1, "playerController2d");

  var network = game.entities.getComponent(entity, "network");

  importComponents(game, network);

  network.time += elapsed;

  if (network.time - network.lastPacketTime > PACKET_RATE) {
    network.lastPacketTime = network.time;
    sendWorld(game, network.lastPacketTime);
  }
}

function sendWorld(game, time) {
  var message = {
    time: time,
    entities: [
      serialize(game, player1, ["position", "velocity"]),
      serialize(game, player2, ["position", "velocity"]),
      serialize(game, ball, ["position", "velocity"])
    ]
  };
  peer.send(JSON.stringify(message));
}

function handleClient(game, entity, elapsed) {
  game.entities.addComponent(player2, "playerController2d");
  var network = game.entities.getComponent(entity, "network");
  network.time += elapsed;
  sendClient(game, network.time);
  importComponents(game, network);
}

function sendClient(game, time) {
  var message = {
    time: time,
    entities: [
      serialize(game, player2, ["movement2d"])
    ]
  };
  peer.send(JSON.stringify(message));
}

function importComponents(game, network) {
  for (var i = 0; i < incomingMessages.length; i++) {
    var msg = incomingMessages[i];
    if (msg.time <= network.peerTime) {
      console.log("skipping", msg.time, network.peerTime);
      continue;
    }
    network.peerTime = msg.time;

    var entities = msg.entities || [];
    for (var j = 0; j < entities.length; j++) {
      deserialize(game, entities[j]);
    }
  }
  incomingMessages.length = 0;
}
