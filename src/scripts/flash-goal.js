"use strict";

module.exports = function(entity, game) {
  game.entities.getComponent(entity, "timers").flashGoal.running = false;
  var model = game.entities.getComponent(entity, "model");
  model.options.color = "0xffffff";
  model.needsUpdate = true;
  console.log("goal flash end", entity);
};
