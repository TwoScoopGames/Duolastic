"use strict";

module.exports = function(entity, game) {
  var position = game.entities.getComponent(entity, "position");
  game.entities.getComponent(entity, "timers").showWall.running = false;
  if (entity === 3001) {
    position.x = -3750;
  }
  if (entity === 4001) {
    position.x = 3750;
  }
  console.log("boop", entity);
};
