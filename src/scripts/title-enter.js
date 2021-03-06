var constants = require("../constants");
var starfield = require("../starfield");
var uuidV4 = require("uuid/v4");
var generatePlayerProfile = require("../generate-player-profile");
var getUserId = require("../get-user-id");

module.exports = function(game) { // eslint-disable-line no-unused-vars
  var usernameTestModel = game.entities.getComponent(4321, "model");
  usernameTestModel.options.text = "Welcome back, " + generatePlayerProfile(getUserId()).username + ".";

  var locationTestModel = game.entities.getComponent(4322, "model");
  locationTestModel.options.text = "We will be arriving at " + generatePlayerProfile(uuidV4()).location + " shortly.";

  game.sounds.stop("fly.mp3");
  game.sounds.play("title-screen.mp3", true);

  game.scaleCanvasToFitRectangle(constants.courtWidth, constants.courtHeight);
  starfield.spawn(game, {
    stars: 500,
    direction: "z",
    velocity: 5,
    image: "images/star.png",
    cube: {
      "width": 1000,
      "height": 1000,
      "depth": 1000,
      "x": 0,
      "y": 0,
      "z": -5000
    }
  });
};
