var math2d = require("splat-ecs/lib/math2d");

module.exports = function(ecs, game) { // eslint-disable-line no-unused-vars
  ecs.add(function(entities, elapsed) { // eslint-disable-line no-unused-vars
    var player1 = 2;
    var player2 = 3;
    var ball = 4;

    collide(game, player1, player2);
    collide(game, player1, ball);
    collide(game, player2, ball);

    keepOnScreen(game, player1);
    keepOnScreen(game, player2);
    keepOnScreen(game, ball);
  });
};

function collide(game, a, b) {
  var positionA = game.entities.getComponent(a, "position");
  var circleA = game.entities.getComponent(a, "circle");
  var velocityA = game.entities.getComponent(a, "velocity");

  var positionB = game.entities.getComponent(b, "position");
  var circleB = game.entities.getComponent(b, "circle");
  var velocityB = game.entities.getComponent(b, "velocity");

  var collisionDistance = circleA.radius + circleB.radius;
  var distSq = math2d.distanceSquared(positionA.x, positionA.y, positionB.x, positionB.y);
  if (distSq > collisionDistance * collisionDistance) {
    return;
  }

  // velocityB.x *= -1;
  // velocityB.y *= -1;
  // velocityB.x += velocityA.x;
  // velocityB.y += velocityA.y;

  var massA = 10;
  var massB = 10;

  var newVelocityAX = (velocityA.x * (massA - massB) + (2 * massB * velocityB.x)) / (massA + massB);
  var newVelocityAY = (velocityA.y * (massA - massB) + (2 * massB * velocityB.y)) / (massA + massB);
  var newVelocityBX = (velocityB.x * (massB - massA) + (2 * massA * velocityA.x)) / (massA + massB);
  var newVelocityBY = (velocityB.y * (massB - massA) + (2 * massA * velocityA.y)) / (massA + massB);
  velocityA.x = newVelocityAX;
  velocityA.y = newVelocityAY;
  velocityB.x = newVelocityBX;
  velocityB.y = newVelocityBY;
}

var screenWidth = 800;
var screenHeight = 600;

function keepOnScreen(game, entity) {
  var position = game.entities.getComponent(entity, "position");
  var circle = game.entities.getComponent(entity, "circle");
  var velocity = game.entities.getComponent(entity, "velocity");

  if (position.x - circle.radius < 0) {
    position.x = circle.radius;
    if (velocity.x < 0) {
      velocity.x *= -1;
    }
  }
  if (position.x + circle.radius > screenWidth) {
    position.x = screenWidth - circle.radius;
    if (velocity.x > 0) {
      velocity.x *= -1;
    }
  }

  if (position.y - circle.radius < 0) {
    position.y = circle.radius;
    if (velocity.y < 0) {
      velocity.y *= -1;
    }
  }
  if (position.y + circle.radius > screenHeight) {
    position.y = screenHeight - circle.radius;
    if (velocity.y > 0) {
      velocity.y *= -1;
    }
  }
}
