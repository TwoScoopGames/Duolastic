
module.exports = function(entity, game) { // eslint-disable-line no-unused-vars
  var model = game.entities.getComponent(entity, "model");
  model.options.fillStyle = "white";
  model.needsUpdate = true;
};
