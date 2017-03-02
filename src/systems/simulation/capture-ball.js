var constants = require("../../constants");

module.exports = function(ecs, game) {
  ecs.addEach(function controlPlayerHole(entity) {
    var hole = game.entities.getComponent(entity, "hole");
    if (!hole.active || !hole.hasBall) {
      return;
    }

    var ballPosition = game.entities.getComponent(constants.ball, "position");
    var ballVelocity = game.entities.getComponent(constants.ball, "velocity");
    ballVelocity.x = 0;
    ballVelocity.y = 0;

    var playerPosition = game.entities.getComponent(entity, "position");
    ballPosition.x = playerPosition.x;
    ballPosition.y = playerPosition.y;
  }, "hole");
};
