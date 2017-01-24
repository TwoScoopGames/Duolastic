var constants = require("../../constants");

module.exports = function(ecs, game) { // eslint-disable-line no-unused-vars
  ecs.addEach(function(entity, elapsed) { // eslint-disable-line no-unused-vars
    var network = game.entities.getComponent(entity, "network");
    if (network.state === "connected") {
      return;
    }

    game.context.fillStyle = "#000000";
    game.context.font = "60px sans-serif";
    var m = message(network.state);
    var w = game.context.measureText(m).width;
    game.context.fillText(m, (constants.screenWidth / 2) - (w / 2), constants.screenHeight / 2);
  }, "network");
};

function message(state) {
  switch (state) {
  case "connecting":
    return "Waiting for opponent";
  case "disconnected":
    return "Opponent left";
  }
}
