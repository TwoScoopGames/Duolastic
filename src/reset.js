var constants = require("./constants");

module.exports = function reset(game) {
  var pos = game.entities.getComponent(constants.court, "position");
  var size = game.entities.getComponent(constants.court, "size");

  resetCenter(game, constants.player1, 0.9, pos, size);
  resetCenter(game, constants.player2, 0.1, pos, size);
  resetCenter(game, constants.ball, 0.5, pos, size);
};

function resetCenter(game, entity, percent, targetPos, targetSize) {
  var position = game.entities.getComponent(entity, "position");
  position.x = targetPos.x;
  position.y = targetPos.y - (targetSize.height / 2) + (targetSize.height * percent);

  var velocity = game.entities.getComponent(entity, "velocity");
  velocity.x = 0;
  velocity.y = 0;
}
