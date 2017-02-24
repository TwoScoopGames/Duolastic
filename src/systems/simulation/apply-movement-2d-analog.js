var constants = require("../../constants");
module.exports = function(ecs, game) {
  game.entities.registerSearch("applyMovement2dAnalog", ["velocity", "movement2dAnalog"]);
  ecs.addEach(function applyMovement2dAnalog(entity) {
    var velocity = game.entities.getComponent(entity, "velocity");
    var movement2dAnalog = game.entities.getComponent(entity, "movement2dAnalog");
    var networkRole = game.entities.getComponent(constants.network, "network").role;
    var youArePlayer1 = networkRole === "server";


    var velocityY = movement2dAnalog.magnitude * movement2dAnalog.accel * Math.sin(movement2dAnalog.angle);
    var velocityX = movement2dAnalog.magnitude * movement2dAnalog.accel * Math.cos(movement2dAnalog.angle);

    var magnitude, angle;

    if (youArePlayer1) {
      velocity.x -= velocityX;
      velocity.y += velocityY;
      console.log("Player1:", velocity.x, velocity.y);
    } else {
      velocity.x += velocityX;
      velocity.y += velocityY;
      console.log("Player2:", velocity.x, velocity.y);
    }

    magnitude = Math.sqrt((velocity.x * velocity.x) + (velocity.y * velocity.y));
    if (magnitude > movement2dAnalog.max) {
      angle = Math.atan2(velocity.y, velocity.x);
      velocity.x = movement2dAnalog.max * Math.cos(angle);
      velocity.y = movement2dAnalog.max * Math.sin(angle);
    }

  }, "applyMovement2dAnalog");
};
