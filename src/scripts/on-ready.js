
module.exports = function(entity, game) {
  console.log("ready!", entity);
  game.entities.destroy(entity);
};
