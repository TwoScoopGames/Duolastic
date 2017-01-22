var constants = require("./constants");

module.exports = function reset(game) {
  resetCenter(game, constants.player1, 0.1);
  resetCenter(game, constants.player2, 0.9);
  resetCenter(game, constants.ball, 0.5);
};

function resetCenter(game, entity, percent) {
  var position = game.entities.getComponent(entity, "position");
  position.x = constants.screenWidth * percent;
  position.y = constants.screenHeight / 2;

  var velocity = game.entities.getComponent(entity, "velocity");
  velocity.x = 0;
  velocity.y = 0;
}
