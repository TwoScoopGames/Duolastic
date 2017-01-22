var constants = require("./constants");

var topDepth = 2;

module.exports = function coordinateToScreen(x, y, player) {
  if (player === 2) {
    y = constants.screenHeight - y;
  }
  var yratio = 1 - (y / constants.screenHeight);
  var z = 1 + (topDepth - 1) * yratio;

  x -= constants.screenWidth / 2;
  return {
    x: x / z,
    y: y / z
  };
};
