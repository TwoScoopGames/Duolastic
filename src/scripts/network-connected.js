var addPlayerController = require("../add-player-controller");

module.exports = function(entity, game) {
  var network = game.entities.getComponent(entity, "network");
  if (network.role === "server") {
    console.log("connect server");
    addPlayerController.player1(game);
  } else {
    console.log("connect client");
    addPlayerController.player2(game);
  }
  game.sounds.stop("144027__kasa90__loopx.mp3");
  game.sounds.play("fly.mp3", true);
  //game.sounds.play("game-start.mp3");
};
