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
    peer.close();
  });
  ecs.addEach(function(entity, elapsed) { // eslint-disable-line no-unused-vars
    var network = game.entities.getComponent(entity, "network");
    if (!peer) {
      if (network.state === "connected") {
        network.state = "disconnected";
      }
      updateNetworkStateText(game, network);
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

function handleServer(game, network, elapsed) {
  // FIXME: this belongs in user code
  var playerController = game.entities.addComponent(constants.player1, "playerController2d");
  playerController.left = "right";
  playerController.right = "left";
  game.entities.addComponent(constants.player1, "playerController2dAnalog");

  moveCamera(game, 900, Math.PI / 8, constants.player1);

  updateNetworkStateText(game, network);

  network.role = "server";
  network.time += elapsed;

  importComponents(game, network);

  if (network.time - network.lastPacketTime > network.packetRate) {
    network.lastPacketTime = network.time;
    sendWorld(game, network.time);
  }
}

function updateNetworkStateText(game, network) {
  var networkStateModel = game.entities.getComponent(constants.networkStateText, "model");
  if (networkStateModel.options.text != network.state) {
    networkStateModel.needsUpdate = true;
    networkStateModel.options.text = network.state;
  }
}

// FIME: this should go somewhere else
var THREE = require("three");
var math2d = require("splat-ecs/lib/math2d");
function moveCamera(game, distance, angle, follow) {
  var followPosition = game.entities.getComponent(follow, "position");

  var courtPosition = game.entities.getComponent(constants.court, "position");
  var courtModel = game.entities.getComponent(constants.court, "model");


  var followAngle = Math.atan2(followPosition.y - courtPosition.y, followPosition.x - courtPosition.x);
  var dist = Math.sqrt(math2d.distanceSquared(followPosition.x, followPosition.y, courtPosition.x, courtPosition.y)) * 0.1;

  var followX = courtPosition.x + (dist * Math.cos(followAngle));
  var followY = courtPosition.y + (dist * Math.sin(followAngle));
  var followZ = courtPosition.z + (courtModel.options.depth / 2);

  var position = game.entities.getComponent(constants.camera, "position");
  position.x = courtPosition.x;
  position.y = courtPosition.y + (distance * Math.cos(angle));
  position.z = courtPosition.z + (distance * Math.sin(angle)) + (courtModel.options.depth / 2);

  var quaternion = game.entities.getComponent(constants.camera, "quaternion");
  var model = game.entities.getComponent(constants.camera, "model");
  model.mesh.lookAt(new THREE.Vector3(followX, followY, followZ));
  model.mesh.up.set(0, 0, 1);
  quaternion.x = model.mesh.quaternion.x;
  quaternion.y = model.mesh.quaternion.y;
  quaternion.z = model.mesh.quaternion.z;
  quaternion.w = model.mesh.quaternion.w;
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

  moveCamera(game, 900, 7 * Math.PI / 8, constants.player2);

  updateNetworkStateText(game, network);

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
      serialize(game, constants.player2, ["movement2d", "movement2dAnalog"])
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
