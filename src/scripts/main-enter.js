var constants = require("../constants");
var reset = require("../reset");
var starfield = require("../starfield");

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


  starfield.spawn(game, {
    parentId: 1908,
    stars: 2000,
    direction: "z",
    velocity: 0,
    image: "images/star.png",
    cube: {
      "width": 10000,
      "height": 10000,
      "depth": 10000,
      "x": 0,
      "y": 0,
      "z": 0
    },
    innerCube: {
      "width": 1000,
      "height": 1000,
      "depth": 1000,
      "x": 0,
      "y": 0,
      "z": 0
    }
  });
};


function setRadius(game, entity, radius) {
  var model = game.entities.getComponent(entity, "model");
  delete model.options.mesh;
  var circle = game.entities.getComponent(entity, "circle");
  model.options.radiusTop =
    model.options.radiusBottom =
    circle.radius = radius;
}
