var constants = require("../../constants");
var createPeerConnection = require("../../peer");
var deserialize = require("../../serialize").deserialize;
var serialize = require("../../serialize").serialize;

var peer;
var incomingMessages = [];

function peerConnected(err, p) {
  if (err) {
    console.error(err);
    return;
  }
  peer = p;
  console.log("got a peer", peer, peer.initiator);
  peer.on("data", function(data) {
    incomingMessages.push(JSON.parse(data.toString()));
  });
  peer.on("close", function() {
    console.log("close");
    peer = undefined;
  });
}

module.exports = function(ecs, game) { // eslint-disable-line no-unused-vars
  game.entities.onAddComponent("network", function() {
    createPeerConnection(peerConnected);
  });
  game.entities.onRemoveComponent("network", function() {
    peer.close();
  });
  ecs.addEach(function(entity, elapsed) { // eslint-disable-line no-unused-vars
    var network = game.entities.getComponent(entity, "network");
    if (!peer) {
      if (network.state === "connected") {
        network.state = "disconnected";
      }
      return;
    }
    network.state = "connected";

    if (peer.initiator) {
      handleServer(game, network, elapsed);
    } else {
      handleClient(game, network, elapsed);
    }
  }, "network");
};

// FIME: this should go somewhere else
var THREE = require("three");
function setFromAxisAngle(quaternion, x, y, z, angle) {
  var q = new THREE.Quaternion();
  q.setFromAxisAngle(new THREE.Vector3(x, y, z), angle);
  quaternion.x = q.x;
  quaternion.y = q.y;
  quaternion.z = q.z;
  quaternion.w = q.w;
}

function handleServer(game, network, elapsed) {
  // FIXME: this belongs in user code
  var playerController = game.entities.addComponent(constants.player1, "playerController2d");
  playerController.left = "right";
  playerController.right = "left";
  game.entities.addComponent(constants.player1, "playerController2dAnalog");

  var quaternion = game.entities.getComponent(constants.camera, "quaternion");
  setFromAxisAngle(quaternion, 0, 0, 1, Math.PI);

  network.role = "server";
  network.time += elapsed;

  importComponents(game, network);

  if (network.time - network.lastPacketTime > network.packetRate) {
    network.lastPacketTime = network.time;
    sendWorld(game, network.time);
  }
}

function sendWorld(game, time) {
  var message = {
    time: time,
    entities: [
      serialize(game, constants.player1, ["position", "velocity"]),
      serialize(game, constants.player2, ["position", "velocity"]),
      serialize(game, constants.ball, ["position", "velocity"]),
      serialize(game, constants.score, ["score"])
    ]
  };
  peer.send(JSON.stringify(message));
}

function handleClient(game, network, elapsed) {
  // FIXME: this belongs in user code
  var playerController = game.entities.addComponent(constants.player2, "playerController2d");
  playerController.up = "down";
  playerController.down = "up";
  game.entities.addComponent(constants.player2, "playerController2dAnalog");

  network.role = "client";
  network.time += elapsed;

  importComponents(game, network);

  if (network.time - network.lastPacketTime > network.packetRate) {
    network.lastPacketTime = network.time;
    sendClient(game, network.time);
  }
}

function sendClient(game, time) {
  var message = {
    time: time,
    entities: [
      serialize(game, constants.player2, ["movement2d"])
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
