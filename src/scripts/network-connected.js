var constants = require("../constants");

module.exports = function(entity, game) {
  var network = game.entities.getComponent(entity, "network");
  if (network.role === "server") {
    console.log("connect server");
    handleServer(game);
  } else {
    console.log("connect client");
    handleClient(game);
  }
  game.sounds.play("fly.mp3", true);
  //game.sounds.play("game-start.mp3");
};

function handleServer(game) {
  var playerController = game.entities.addComponent(constants.player1, "playerController2d");
  playerController.left = "right";
  playerController.right = "left";
  var playerControllerAnalog = game.entities.addComponent(constants.player1, "playerController2dAnalog");
  playerControllerAnalog.xScale = -1;
}

function handleClient(game) {
  var playerController = game.entities.addComponent(constants.player2, "playerController2d");
  playerController.up = "down";
  playerController.down = "up";
  var playerControllerAnalog = game.entities.addComponent(constants.player2, "playerController2dAnalog");
  playerControllerAnalog.yScale = -1;
}
