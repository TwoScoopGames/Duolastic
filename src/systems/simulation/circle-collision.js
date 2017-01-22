var constants = require("../../constants");
var math2d = require("splat-ecs/lib/math2d");
var reset = require("../../reset");
var vec2 = require("../../vec2");

module.exports = function(ecs, game) { // eslint-disable-line no-unused-vars
  ecs.add(function(entities, elapsed) { // eslint-disable-line no-unused-vars
    collide(game, constants.player1, constants.player2);
    collide(game, constants.player1, constants.ball);
    collide(game, constants.player2, constants.ball);

    keepOnScreen(game, constants.player1);
    keepOnScreen(game, constants.player2);
    keepInSides(game, constants.ball);
    checkScore(game, constants.ball);
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
  if (position.x + circle.radius > constants.screenWidth) {
    position.x = constants.screenWidth - circle.radius;
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
  if (position.y + circle.radius > constants.screenHeight) {
    position.y = constants.screenHeight - circle.radius;
    if (velocity.y > 0) {
      velocity.y *= -1;
    }
  }
}

function checkScore(game, entity) {
  var position = game.entities.getComponent(entity, "position");
  var circle = game.entities.getComponent(entity, "circle");
  var score = game.entities.getComponent(constants.score, "score");

  if (position.x < -circle.radius) {
    console.log("player 2 scored");
    score.player2++;
    reset(game);
  }
  if (position.x > constants.screenWidth + circle.radius) {
    console.log("player 1 scored");
    score.player1++;
    reset(game);
  }
}
