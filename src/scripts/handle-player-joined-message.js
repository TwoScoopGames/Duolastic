var constants = require("../constants");
var createStack = require("../create-stack");

module.exports = function(game, network, msg) {
  if (network.role === "server") {
    game.entities.setComponent(constants.player2, "uuid", msg.uuid);
    createStack(game, constants.player2);
  } else {
    game.entities.setComponent(constants.player1, "uuid", msg.uuid);
    createStack(game, constants.player1);
  }
};
