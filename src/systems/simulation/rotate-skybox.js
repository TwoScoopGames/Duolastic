"use strict";

module.exports = function(ecs, game) { // eslint-disable-line no-unused-vars
  ecs.addEach(function(entity, elapsed) { // eslint-disable-line no-unused-vars
    var quaternion = game.entities.getComponent(entity, "quaternion");
    quaternion.x += 0.1;
    quaternion.w += 0.1;
  }, "court");
};
