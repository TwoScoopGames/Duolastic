"use strict";

module.exports = function(entity, game) {
  var easing = game.entities.addComponent(entity, "easing");
  easing["position.z"] = {
    "type": "easeInElastic",
    "start": -100,
    "end": 0,
    "time": 0,
    "max": 1500
  };
  var easing2 = game.entities.addComponent(entity, "easing");
  easing2["position.y"] = {
    "type": "easeInElastic",
    "start": 50,
    "end": 0,
    "time": 0,
    "max": 1500
  };
};
