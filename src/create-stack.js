var colorPalette = require("./color-palette");

module.exports = function createStack(game, baseEntity) {
  var circle = game.entities.getComponent(baseEntity, "circle");
  var uuid = game.entities.getComponent(baseEntity, "uuid");
  var newColors = colorPalette.palette(uuid);
  var fixedNewColors = newColors.map(function(hexcode) {
    return "0x" + hexcode;
  });

  circle.colorSet = fixedNewColors;

  var baseEntityModel = game.entities.getComponent(baseEntity, "model");
  var baseEntityPosition = game.entities.getComponent(baseEntity, "position");
  var segmentSize = baseEntityModel.options.radiusBottom / circle.colorSet.length;
  var parent = baseEntity;
  var entity = baseEntity;
  for (var i = 0; i < circle.colorSet.length; i++) {
    entity = createCylinder(game, parent, entity, baseEntityPosition, baseEntityModel, segmentSize, circle.colorSet, i);
  }
};

function createCylinder(game, parent, previousEntity, baseEntityPosition, baseEntityModel, segmentSize, colorSet, i) {
  var newEntity = game.entities.create();

  var model = game.entities.addComponent(newEntity, "model");
  model.name = "cylinder";
  model.options = {};
  model.options.radiusTop = baseEntityModel.options.radiusBottom - (segmentSize * (i + 1));
  model.options.radiusBottom = baseEntityModel.options.radiusBottom - (segmentSize * i);

  model.options.height = baseEntityModel.options.height;
  model.options.radiusSegments = baseEntityModel.options.radiusSegments;
  model.options.color = colorSet[i];

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
