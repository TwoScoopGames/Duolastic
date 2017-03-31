var constants = require("../constants");
var starfield = require("../starfield");
var uuidV4 = require("uuid/v4");
var namegen = require("../namegen");
var getUserId = require("../get-user-id");

module.exports = function(game) { // eslint-disable-line no-unused-vars
  var usernameTestModel = game.entities.getComponent(4321, "model");
  usernameTestModel.options.text = "Welcome back, " + namegen.username(getUserId()) + ".";

  var locationTestModel = game.entities.getComponent(4322, "model");
  locationTestModel.options.text = "We will be arriving at " + namegen.location(uuidV4()) + " shortly.";

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
