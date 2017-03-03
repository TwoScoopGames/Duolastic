"use strict";

module.exports = function(entity, game) {
  var easing = game.entities.addComponent(entity, "easing");
  easing["position.z"] = {
    "type": "easeOutElastic",
    "start": 0,
    "end": -100,
    "time": 0,
    "max": 1500
  };
  var easing2 = game.entities.addComponent(entity, "easing");
  easing2["position.y"] = {
    "type": "easeOutElastic",
    "start": 0,
    "end": 50,
    "time": 0,
    "max": 1500
  };
};
