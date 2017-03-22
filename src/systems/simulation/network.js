var constants = require("../../constants");
var createPeerConnection = require("../../peer");
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
      processIncomingMessages(game, network);
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
    type: "sync",
    entities: [
      serialize(game, constants.player1, ["position", "velocity", "hole"]),
      serialize(game, constants.player2, ["position", "velocity", "hole"]),
      serialize(game, constants.ball, ["position", "velocity"]),
      serialize(game, constants.score, ["score"])
    ]
  };
  trySend(JSON.stringify(message));
}

function sendClient(game, time) {
  var message = {
    time: time,
    type: "sync",
    entities: [
      serialize(game, constants.player2, ["movement2d", "movement2dAnalog", "hole"])
    ]
  };
  trySend(JSON.stringify(message));
}

function trySend(message) {
  if (peer !== undefined) {
    try {
      peer.send(message);
    } catch (e) {
      console.error("error sending message", e);
    }
  } else {
    console.warn("peer is undefined, cannot send message");
  }
}

function processIncomingMessages(game, network) {
  var messageHandlers = getHandlers(game, network);
  for (var i = 0; i < incomingMessages.length; i++) {
    var msg = incomingMessages[i];
    processIncomingMessage(game, network, msg, messageHandlers);
  }
  incomingMessages.length = 0;
}

function getHandlers(game, network) {
  var keys = Object.keys(network.messageHandlers);
  var handlers = {};
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    handlers[key] = game.require(network.messageHandlers[key]);
  }
  return handlers;
}

function processIncomingMessage(game, network, msg, messageHandlers) {
  if (msg.time <= network.peerTime) {
    console.log("skipping", msg.time, network.peerTime);
    return;
  }
  network.peerTime = msg.time;

  var handler = messageHandlers[msg.type] || unhandledMessageHandler;
  handler(game, msg);
}

function unhandledMessageHandler(game, msg) {
  console.warn("unhandled message type:", msg.type);
}
