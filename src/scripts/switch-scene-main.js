
module.exports = function(entity, game) {
  murder(game, "model");
  murder(game, "network");
  game.switchScene("main");
};

function murder(game, component) {
  var ids = game.entities.find(component).slice(0);
  for (var i = 0; i < ids.length; i++) {
    game.entities.removeComponent(ids[i], component);
  }
}
