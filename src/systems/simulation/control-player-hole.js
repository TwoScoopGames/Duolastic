var addPlayerController = require("../../add-player-controller");

module.exports = function(ecs, game) {
  ecs.addEach(function controlPlayerHole(entity) {
    var network = game.entities.find("network")[0];
    if (!network) {
      return;
    }
    var networkRole = game.entities.getComponent(network, "network").role;
    var youArePlayer1 = networkRole === "server";

    var hole = game.entities.getComponent(entity, "hole");
    if (game.inputs.button(hole.input) === hole.active) {
      return;
    }

    hole.active = !hole.active;

    if (hole.active) {
      game.entities.removeComponent(entity, "playerController2d");
      game.entities.removeComponent(entity, "playerController2dAnalog");

      var movement2d = game.entities.getComponent(entity, "movement2d");
      if (movement2d) {
        movement2d.up = false;
        movement2d.down = false;
        movement2d.left = false;
        movement2d.right = false;
      }
      var movement2dAnalog = game.entities.getComponent(entity, "movement2dAnalog");
      if (movement2dAnalog) {
        movement2dAnalog.magnitude = 0;
      }
    } else {
      if (youArePlayer1) {
        addPlayerController.player1(game);
      } else {
        addPlayerController.player2(game);
      }
    }
  }, "hole");
};
