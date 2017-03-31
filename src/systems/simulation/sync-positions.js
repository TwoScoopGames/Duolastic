var constants = require("../../constants");
var serialize = require("../../serialize").serialize;

module.exports = function(ecs, game) { // eslint-disable-line no-unused-vars
  ecs.addEach(function(entity, elapsed) { // eslint-disable-line no-unused-vars
    var network = game.entities.getComponent(entity, "network");

    if (network.state === "connected") {
      generateSyncMessages(game, network);
    }
  }, "network");
};

function generateSyncMessages(game, network) {
  if (network.time - network.lastPacketTime <= network.packetRate) {
    return;
  }
  network.lastPacketTime = network.time;
  if (network.role === "server") {
    sendWorld(game, network);
  } else {
    sendClient(game, network);
  }
}

function sendWorld(game, network) {
  var message = {
    time: network.time,
    type: "sync",
    entities: [
      serialize(game, constants.player1, ["position", "velocity", "hole"]),
      serialize(game, constants.player2, ["position", "velocity", "hole"]),
      serialize(game, constants.ball, ["position", "velocity"]),
      serialize(game, constants.score, ["score"])
    ]
  };
  queueMessage(network, message);
}

function sendClient(game, network) {
  var message = {
    type: "sync",
    entities: [
      serialize(game, constants.player2, ["movement2d", "movement2dAnalog", "hole"])
    ]
  };
  queueMessage(network, message);
}

function queueMessage(network, message) {
  network.outgoingMessages.push(message);
}
