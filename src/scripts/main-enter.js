var reset = require("../reset");
var constants = require("../constants");

module.exports = function(game) { // eslint-disable-line no-unused-vars
  reset(game);
  game.scaleCanvasToFitRectangle(constants.screenWidth, constants.screenHeight);
};
