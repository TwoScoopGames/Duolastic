"use strict";

module.exports = function(entity, game) {
  game.entities.getComponent(entity, "timers").flashGoal.running = false;
  game.entities.getComponent(entity, "model").options.color = "0xffffff";
  console.log("goal flash", entity);
};
