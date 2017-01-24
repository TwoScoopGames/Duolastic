var constants = require("../../constants");

module.exports = function(ecs, game) { // eslint-disable-line no-unused-vars
  ecs.addEach(function(entity, elapsed) { // eslint-disable-line no-unused-vars
    var follow = game.entities.getComponent(entity, "follow");
    var position = game.entities.getComponent(entity, "position");
    var parentPosition = game.entities.getComponent(follow.id, "position");

    var player = game.entities.getComponent(constants.network, "network").player;

    // FIXME: this is broken, and causes position to become NaN
    // Not sure why :-(
    var easing = game.entities.addComponent(entity, "easing");
    easing["position.x"] = {
      "type": "easeOutElastic",
      "start": position.x,
      "end": parentPosition.x,
      "time": 0,
      "max": 500
    };
    easing["position.y"] = {
      "type": "easeOutElastic",
      "start": position.y,
      "end": player === 1 ? parentPosition.y - 100 : parentPosition.y + 100,
      "time": 0,
      "max": 500
    };
  }, "follow");
};
