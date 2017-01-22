var constants = require("../../constants");
var coordinateToScreen = require("../../coordinate-to-screen");

module.exports = function(ecs, game) { // eslint-disable-line no-unused-vars
  ecs.addEach(function(entity, elapsed) { // eslint-disable-line no-unused-vars
    var score = game.entities.getComponent(entity, "score");
    var player = game.entities.getComponent(constants.network, "network").player;

    game.context.setTransform(1, 0, 0, 1, constants.screenWidth / 2, 0);

    game.context.fillStyle = "#000000";
    var p = coordinateToScreen(-30, (constants.screenHeight / 4));
    game.context.fillText(player === 1 ? score.player2 : score.player1, p.x, p.y);
    p = coordinateToScreen(-30, (constants.screenHeight / 4) * 3);
    game.context.fillText(player === 1 ? score.player1 : score.player2, p.x, p.y);

    game.context.setTransform(1, 0, 0, 1, 0, 0);
  }, "score");
};
