var constants = require("../../constants");

module.exports = function(ecs, game) { // eslint-disable-line no-unused-vars
  ecs.addEach(function(entity, elapsed) { // eslint-disable-line no-unused-vars
    var courtPos = game.entities.getComponent(constants.court, "position");
    var courtSize = game.entities.getComponent(constants.court, "size");
    var courtLeft = courtPos.x - (courtSize.width / 2);
    var courtRight = courtLeft + courtSize.width;
    var position = game.entities.getComponent(entity, "position");
    var circle = game.entities.getComponent(entity, "circle");
      //left side
    var wallLeft = 3001;
    var wallTimerLeft = game.entities.getComponent(wallLeft, "timers").showWall;
    var wallPositionLeft = game.entities.getComponent(wallLeft, "position");
    if ((position.x - circle.radius) < courtLeft) {
      wallTimerLeft.running = true;
      wallPositionLeft.x = -375;
    }

    //right side
    var wallRight = 4001;
    var wallTimerRight = game.entities.getComponent(wallRight, "timers").showWall;
    var wallPositionRight = game.entities.getComponent(wallRight, "position");
    if ((position.x + circle.radius) > courtRight) {
      wallTimerRight.running = true;
      wallPositionRight.x = 375;
    }
  }, "ball");
};
