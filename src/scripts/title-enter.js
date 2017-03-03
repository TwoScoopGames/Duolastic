//var reset = require("../reset");
var constants = require("../constants");
var random = require("splat-ecs/lib/random");

module.exports = function(game) { // eslint-disable-line no-unused-vars

  game.sounds.stop("fly.mp3");
  game.sounds.play("144027__kasa90__loopx.mp3", true);
  game.scaleCanvasToFitRectangle(constants.courtWidth, constants.courtHeight);
  var cube = {
    "width": 16000,
    "height": 10000,
    "depth": 10000,
    "x": 0,
    "y": 0,
    "z": -5000
  };
  createStarfield(game, 200, cube, "images/star.png");
};




function createStarfield(game, quantity, cube, image) {
  for (var i = 0; i < quantity; i++) {
    var position = {};
    position.x = random.inRange(cube.x - (cube.width / 2), cube.x + (cube.width / 2));
    position.y = random.inRange(cube.y - (cube.height / 2), cube.y + (cube.height / 2));
    position.z = random.inRange(cube.z - (cube.depth / 2), cube.z + (cube.depth / 2));
    createStar(game, position, cube, image);
  }
}

function createStar(game, position, cube, image) {
  var newEntity = game.entities.create();



  var model = game.entities.addComponent(newEntity, "model");
  model.name = "sprite";
  model.options = {};

  model.options.color = "0xffffff";
  model.options.height = 64;
  model.options.width = 64;
  model.options.texture = image;
  var newPosition = game.entities.addComponent(newEntity, "position");
  newPosition.x = position.x;
  newPosition.y = position.y;
  newPosition.z = position.z;
  var velocity = game.entities.addComponent(newEntity, "velocity");
  velocity.z = 5;
  game.entities.addComponent(newEntity, "size");

  var resetIfOutsideCube = game.entities.addComponent(newEntity, "resetIfOutsideCube");
  resetIfOutsideCube.origin = position;
  resetIfOutsideCube.cube = cube;

  return newEntity;
}

