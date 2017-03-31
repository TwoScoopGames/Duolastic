var addPlayerController = require("../add-player-controller");
var constants = require("../constants");
var createStack = require("../create-stack");
var getUserId = require("../get-user-id");

module.exports = function(entity, game) {
  var network = game.entities.getComponent(entity, "network");

  if (network.role === "server") {
    console.log("connect server");
    addPlayerController.player1(game);
    game.entities.setComponent(constants.player1, "uuid", getUserId());
    sendPlayerJoined(network);
    createStack(game, constants.player1);
  } else {
    console.log("connect client");
    addPlayerController.player2(game);
    game.entities.setComponent(constants.player2, "uuid", getUserId());
    sendPlayerJoined(network);
    createStack(game, constants.player2);
  }

  game.sounds.stop("title-screen.mp3");
  game.sounds.play("fly.mp3", true);
  //game.sounds.play("game-start.mp3");
};

function sendPlayerJoined(network) {
  network.outgoingMessages.push({
    type: "playerJoined",
    reliable: true,
    uuid: getUserId()
  });
}
