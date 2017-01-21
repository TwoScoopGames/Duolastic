"use strict";

var createPeerConnection = require("../../peer");
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
    console.log("got data", JSON.parse(data.toString()));
    incomingMessages.push(JSON.parse(data.toString()));
  });
  // if (peer.initiator) {
  //   console.log("player 1");
  // } else {
  //   console.log("player 2");
  // }
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

function handleServer(game, entity, elapsed) {
  var network = game.entities.getComponent(entity, "network");
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
      serialize(game, 2)
    ]
  };
  peer.send(JSON.stringify(message));
}

function serialize(game, entity) {
  return {
    id: entity,
    position: game.entities.getComponent(entity, "position"),
    velocity: game.entities.getComponent(entity, "velocity")
  };
}

function handleClient(game) {
  if (incomingMessages.length === 0) {
    return;
  }
  var msg = incomingMessages[incomingMessages.length - 1];
  incomingMessages.length = 0;

  var entities = msg.entities || [];
  for (var i = 0; i < entities.length; i++) {
    deserialize(game, entities[i]);
  }
}

function deserialize(game, entity) {
  var keys = Object.keys(entity);

  for (var i = 0; i < keys.length; i++) {
    if (keys[i] === "id") {
      continue;
    }
    var component = game.entities.getComponent(entity.id, keys[i]);
    merge(component, entity[keys[i]]);
  }
}

function merge(dest, src) {
  var keys = Object.keys(src);

  for (var i = 0; i < keys.length; i++) {
    dest[keys[i]] = src[keys[i]];
  }
}
