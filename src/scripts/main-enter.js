var reset = require("../reset");
var constants = require("../constants");
var config = {
  radiusTop: 0.2,
  radiusBottom: 0.75,
  height: 2.5,
  radiusSegments: 64,
  heightSegments: 1,
  openEnded: false,
  thetaStart: 0,
  thetaLength: 0,
  circleSize: 1,
  scaleY: 1,
  colors: [
    "rgb(89,49,75)",
    "rgb(142,40,62)",
    "rgb(198,55,47)",
    "rgb(241,81,57)",
    "rgb(255,156,31)",
    "rgb(255,207,92)",
    "rgb(249,229,114)",
    "rgb(228,240,128)",
    "rgb(147,213,186)",
    "rgb(85,188,221)",
    "rgb(76,128,175)",
    "rgb(62,88,137)",
    "rgb(89,49,75)"

  ]
};

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
};

function setRadius(game, entity, radius) {
  var model = game.entities.getComponent(entity, "model");
  delete model.options.mesh;
  var circle = game.entities.getComponent(entity, "circle");
  model.options.radiusTop =
    model.options.radiusBottom =
    circle.radius = radius;
}

function createStack(game, baseEntity) {
  var baseEntityModel = game.entities.getComponent(baseEntity, "model");
  var baseEntityPosition = game.entities.getComponent(baseEntity, "position");
  var segmentSize = baseEntityModel.options.radiusBottom / config.colors.length;
  var entity = baseEntity;
  for (var i = 0; i < config.colors.length; i++) {
    entity = createCylinder(game, entity, baseEntityPosition, baseEntityModel, segmentSize, i);
  }
}


function createCylinder(game, previousEntity, baseEntityPosition, baseEntityModel, segmentSize, i) {
  var newEntity = game.entities.create();

  var model = game.entities.addComponent(newEntity, "model");
  model.name = "cylinder";
  model.options = {};
  model.options.radiusTop = baseEntityModel.options.radiusBottom - (segmentSize * (i + 1));
  model.options.radiusBottom = baseEntityModel.options.radiusBottom - (segmentSize * i);

  model.options.height = baseEntityModel.options.height;
  model.options.radiusSegments = baseEntityModel.options.radiusSegments;
  model.options.color = config.colors[i];

  var previousEntityPosition = game.entities.getComponent(previousEntity, "position");
  var newEntityPosition = game.entities.addComponent(newEntity, "position");
  newEntityPosition.x = previousEntityPosition.x;
  newEntityPosition.y = previousEntityPosition.y;
  newEntityPosition.z = previousEntityPosition.z + baseEntityModel.options.height;

  var quaternion = game.entities.addComponent(newEntity, "quaternion");
  quaternion.x = 0.7071067811865475;
  quaternion.y = 0;
  quaternion.z = 0;
  quaternion.w = 0.7071067811865476;

  game.entities.addComponent(newEntity, "size");

  var follow = game.entities.addComponent(newEntity, "follow");
  follow.id = previousEntity;
  follow.distance = segmentSize;
  return newEntity;
}
