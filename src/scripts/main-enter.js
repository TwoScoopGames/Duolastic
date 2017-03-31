var constants = require("../constants");
var createStack = require("../create-stack");
var random = require("splat-ecs/lib/random");
var reset = require("../reset");

module.exports = function(game) { // eslint-disable-line no-unused-vars
  var model = game.entities.getComponent(constants.court, "model");
  model.options.width = constants.courtWidth;
  model.options.height = constants.courtHeight;
  delete model.options.mesh;
  var size = game.entities.getComponent(constants.court, "size");
  size.width = constants.courtWidth;
  size.height = constants.courtHeight;

  setRadius(game, constants.player1, constants.paddleDiameter / 2);
  setRadius(game, constants.player2, constants.paddleDiameter / 2);
  setRadius(game, constants.ball, constants.puckDiameter / 2);

  reset(game);
  game.scaleCanvasToFitRectangle(constants.courtWidth, constants.courtHeight);

  createStack(game, constants.player1);
  createStack(game, constants.player2);

  createStarfield(game, 5600, 500, 10000, "images/star.png");
};

function positionNotInRange(size, cutOut) {
  var x = random.inRange(-size, size);
  if (x > cutOut || x < -cutOut) {
    return x;
  } else {
    positionNotInRange(size, cutOut);
  }
}

function setRadius(game, entity, radius) {
  var model = game.entities.getComponent(entity, "model");
  delete model.options.mesh;
  var circle = game.entities.getComponent(entity, "circle");
  model.options.radiusTop =
    model.options.radiusBottom =
    circle.radius = radius;
}

function createStarfield(game, quantity, innerCubeWidth, outerCubeWidth, image) {
  for (var i = 0; i < 1000; i++) {
    var cutOut = innerCubeWidth / 2;
    var asize = outerCubeWidth / 2;
    var position = {};
    position.x = positionNotInRange(asize, cutOut);
    position.y = positionNotInRange(asize, cutOut);
    position.z = positionNotInRange(asize, cutOut);
    createStar(game, position, image);
  }
}

function createStar(game, position, image) {
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
  game.entities.addComponent(newEntity, "size");
  return newEntity;
}
