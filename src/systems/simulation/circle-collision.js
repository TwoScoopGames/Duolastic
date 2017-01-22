var math2d = require("splat-ecs/lib/math2d");
var vec2 = require("../../vec2");

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

  var v1 = vec2.create(velocityA.x, velocityA.y);
  var x1 = vec2.create(positionA.x, positionA.y);

  var v2 = vec2.create(velocityB.x, velocityB.y);
  var x2 = vec2.create(positionB.x, positionB.y);

  var v1Prime = vec2.subtract(
    v1,
    vec2.multiply(
      vec2.subtract(x1, x2),
      (
        (2 * massB)
        /
        (massA + massB)
      )
      *
      (
        vec2.dot(
          vec2.subtract(v1, v2),
          vec2.subtract(x1, x2)
        )
        /
        (
          vec2.magnitudeSquared(vec2.subtract(x1, x2))
        )
      )
    )
  );
  velocityA.x = v1Prime[0];
  velocityA.y = v1Prime[1];

  var v2Prime = vec2.subtract(
    v2,
    vec2.multiply(
      vec2.subtract(x2, x1),
      (
        (2 * massA)
        /
        (massA + massB)
      )
      *
      (
        vec2.dot(
          vec2.subtract(v2, v1),
          vec2.subtract(x2, x1)
        )
        /
        (
          vec2.magnitudeSquared(vec2.subtract(x2, x1))
        )
      )
    )
  );
  velocityB.x = v2Prime[0];
  velocityB.y = v2Prime[1];
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
