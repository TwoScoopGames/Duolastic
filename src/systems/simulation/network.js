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
  console.log("got a peer", peer);
  console.log("i am ", peer.initiator ? "server" : "client");
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
    if (peer !== undefined) {
      peer.destroy();
      peer = undefined;
    }
  });
  ecs.addEach(function(entity, elapsed) { // eslint-disable-line no-unused-vars
    var network = game.entities.getComponent(entity, "network");
    var oldState = network.state;
    network.state = getNetworkState(network);

    if (oldState !== network.state) {
      if (network.state === "connected") {
        network.role = getNetworkRole();
      }
      var eventName = "on" + capitalizeFirstLetter(network.state);
      fireEvent(game, entity, network[eventName]);
    }

    if (network.state === "connected") {
      network.time += elapsed;
      importComponents(game, network);
      if (network.time - network.lastPacketTime > network.packetRate) {
        network.lastPacketTime = network.time;
        if (peer.initiator) {
          sendWorld(game, network.time);
        } else {
          sendClient(game, network.time);
        }
      }
    }
  }, "network");
};

function getNetworkRole() {
  if (!peer) {
    return "server";
  }
  if (peer.initiator) {
    return "server";
  } else {
    return "client";
  }
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getNetworkState(network) {
  if (peer) {
    return "connected";
  }
  if (network.state !== "connecting") {
    return "disconnected";
  }
  return "connecting";
}

function fireEvent(game, entity, script) {
  console.log("fire", script, entity);
  if (!script) {
    return;
  }
  var handler = game.require(script);
  handler(entity, game);
}

function sendWorld(game, time) {
  var message = {
    time: time,
    entities: [
      serialize(game, constants.player1, ["position", "velocity", "hole"]),
      serialize(game, constants.player2, ["position", "velocity", "hole"]),
      serialize(game, constants.ball, ["position", "velocity"]),
      serialize(game, constants.score, ["score"])
    ]
  };
  peer.send(JSON.stringify(message));
}

function sendClient(game, time) {
  var message = {
    time: time,
    entities: [
      serialize(game, constants.player2, ["movement2d", "movement2dAnalog", "hole"])
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
