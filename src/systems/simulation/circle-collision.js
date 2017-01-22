var math2d = require("splat-ecs/lib/math2d");
var vec2 = require("../../vec2");

var player1 = 2;
var player2 = 3;
var ball = 4;

module.exports = function(ecs, game) { // eslint-disable-line no-unused-vars
  ecs.add(function(entities, elapsed) { // eslint-disable-line no-unused-vars
    collide(game, player1, player2);
    collide(game, player1, ball);
    collide(game, player2, ball);

    keepOnScreen(game, player1);
    keepOnScreen(game, player2);
    keepInSides(game, ball);
    checkScore(game, ball);
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

  var v1 = vec2.create(velocityA.x, velocityA.y);
  var x1 = vec2.create(positionA.x, positionA.y);

  var v2 = vec2.create(velocityB.x, velocityB.y);
  var x2 = vec2.create(positionB.x, positionB.y);

  var m1 = circleA.mass;
  var m2 = circleB.mass;

  var v1Prime = vec2.subtract(
    v1,
    vec2.multiply(
      vec2.subtract(x1, x2),
      (
        (2 * m2)
        /
        (m1 + m2)
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
        (2 * m1)
        /
        (m1 + m2)
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

  keepInSides(game, entity);
}

function keepInSides(game, entity) {
  var position = game.entities.getComponent(entity, "position");
  var circle = game.entities.getComponent(entity, "circle");
  var velocity = game.entities.getComponent(entity, "velocity");

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

function checkScore(game, entity) {
  var position = game.entities.getComponent(entity, "position");
  var circle = game.entities.getComponent(entity, "circle");

  if (position.x < -circle.radius) {
    console.log("player 2 scored");
    reset(game);
  }
  if (position.x > screenWidth + circle.radius) {
    console.log("player 1 scored");
    reset(game);
  }
}

function reset(game) {
  resetCenter(game, player1, 0.1);
  resetCenter(game, player2, 0.9);
  resetCenter(game, ball, 0.5);
}

function resetCenter(game, entity, percent) {
  var position = game.entities.getComponent(entity, "position");
  position.x = screenWidth * percent;
  position.y = screenHeight / 2;

  var velocity = game.entities.getComponent(entity, "velocity");
  velocity.x = 0;
  velocity.y = 0;
}
