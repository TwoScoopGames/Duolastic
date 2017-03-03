
module.exports = function(ecs, game) {
  ecs.add(function restart() {
    if (game.inputs.button("restart")) {
      window.location.reload();
    }
  });
};
