var constants = require("../../constants");

module.exports = function(ecs, game) { // eslint-disable-line no-unused-vars
  ecs.addEach(function(entity, elapsed) { // eslint-disable-line no-unused-vars
    var score = game.entities.getComponent(entity, "score");

    game.context.fillStyle = "#000000";
    game.context.fillText(score.player1, 50, constants.screenHeight - 25);
    game.context.fillText(score.player2, constants.screenWidth - 50, constants.screenHeight - 25);
  }, "score");
};
