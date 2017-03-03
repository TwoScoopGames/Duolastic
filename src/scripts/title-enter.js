//var reset = require("../reset");
var constants = require("../constants");
var starfield = require("../starfield");

module.exports = function(game) { // eslint-disable-line no-unused-vars

  game.sounds.stop("fly.mp3");
  game.sounds.play("title-screen.mp3", true);
  game.scaleCanvasToFitRectangle(constants.courtWidth, constants.courtHeight);
  starfield.spawn(game, {
    stars: 200,
    direction: "z",
    velocity: 5,
    image: "images/star.png",
    cube: {
      "width": 16000,
      "height": 10000,
      "depth": 10000,
      "x": 0,
      "y": 0,
      "z": -5000
    }
  });
};
