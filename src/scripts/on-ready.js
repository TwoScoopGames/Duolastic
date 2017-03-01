
module.exports = function(entity, game) {
  console.log("ready!", entity);
  game.entities.destroy(entity);
  game.prefabs.instantiate(game.entities, "network");
};
