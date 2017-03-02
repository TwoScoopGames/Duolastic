var constants = require("./constants");

module.exports = {
  player1: function(game) {
    var playerController = game.entities.addComponent(constants.player1, "playerController2d");
    playerController.left = "right";
    playerController.right = "left";
    var playerControllerAnalog = game.entities.addComponent(constants.player1, "playerController2dAnalog");
    playerControllerAnalog.xScale = -1;
    game.entities.addComponent(constants.player1, "hole");
  },
  player2: function(game) {
    var playerController = game.entities.addComponent(constants.player2, "playerController2d");
    playerController.up = "down";
    playerController.down = "up";
    var playerControllerAnalog = game.entities.addComponent(constants.player2, "playerController2dAnalog");
    playerControllerAnalog.yScale = -1;
    game.entities.addComponent(constants.player2, "hole");
  }
};
