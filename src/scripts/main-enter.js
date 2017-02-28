var tinycolor = require("tinycolor2");

var reset = require("../reset");
var constants = require("../constants");
var random = require("splat-ecs/lib/random");

module.exports = function(game) { // eslint-disable-line no-unused-vars
  game.sounds.play("game-start.mp3");
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


  for (var i = 0; i < 1000; i++) {
    var cutOut = 250;
    var asize = 5000;
    var position = {};
    position.x = positionNotInRange(asize, cutOut);
    position.y = positionNotInRange(asize, cutOut);
    position.z = positionNotInRange(asize, cutOut);
    createStar(game, position);
  }

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

function createStack(game, baseEntity) {
  var circle = game.entities.getComponent(baseEntity, "circle");
  var baseEntityModel = game.entities.getComponent(baseEntity, "model");
  var baseEntityPosition = game.entities.getComponent(baseEntity, "position");
  var segmentSize = baseEntityModel.options.radiusBottom / circle.colorSet.length;
  var parent = baseEntity;
  var entity = baseEntity;
  for (var i = 0; i < circle.colorSet.length; i++) {
    entity = createCylinder(game, parent, entity, baseEntityPosition, baseEntityModel, segmentSize, circle.colorSet, i);
  }
}


function createCylinder(game, parent, previousEntity, baseEntityPosition, baseEntityModel, segmentSize, colorSet, i) {
  var newEntity = game.entities.create();

  var model = game.entities.addComponent(newEntity, "model");
  model.name = "cylinder";
  model.options = {};
  model.options.radiusTop = baseEntityModel.options.radiusBottom - (segmentSize * (i + 1));
  model.options.radiusBottom = baseEntityModel.options.radiusBottom - (segmentSize * i);

  model.options.height = baseEntityModel.options.height;
  model.options.radiusSegments = baseEntityModel.options.radiusSegments;
  var newColor = colorSet[i];
  if (isOdd(i)) {
    console.log("change color", newColor);
    // var color = tinycolor(newColor)
    var newnewcolor = "#" + newColor.replace("0x","");
    newColor =  tinycolor(newnewcolor).darken(9).toString();
    console.log(newColor);
  }
  model.options.color = newColor;


  model.castShadow = true;
  model.receiveShadow = true;

  var childOf = game.entities.addComponent(newEntity, "childOf");
  childOf.parent = parent;
  childOf.nth = i;

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


function createStar(game, position) {
  var newEntity = game.entities.create();
  var model = game.entities.addComponent(newEntity, "model");
  model.name = "sprite";
  model.options = {};

  model.options.color = "0xffffff";
  // model.options.height = 50;
  // model.options.width = 50;
  // model.options.depth = 50;
  model.options.texture = "images/star.png";
  var newPosition = game.entities.addComponent(newEntity, "position");
  newPosition.x = position.x;
  newPosition.y = position.y;
  newPosition.z = position.z;
  game.entities.addComponent(newEntity, "size");
  return newEntity;
}
// function createStar(game, position) {
//   var newEntity = game.entities.create();
//   var model = game.entities.addComponent(newEntity, "model");
//   model.name = "sprite";
//   model.options = {};
//   //model.options.color = "0xffffff";
//   model.options.texture = "images/star.png";
//   var newPosition = game.entities.addComponent(newEntity, "position");
//   newPosition.x = position.x;
//   newPosition.y = position.y;
//   newPosition.z = position.z;
//   game.entities.addComponent(newEntity, "size");
//   return newEntity;
// }


function isOdd(num) { return num % 2; }


