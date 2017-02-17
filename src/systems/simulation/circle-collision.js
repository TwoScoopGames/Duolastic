var constants = require("../../constants");
var math2d = require("splat-ecs/lib/math2d");
var reset = require("../../reset");
var vec2 = require("../../vec2");
var random = require("splat-ecs/lib/random");

// var drums = [
//   "drum-01.mp3",
//   "drum-02.mp3",
//   "drum-03.mp3",
//   "drum-04.mp3",
//   "drum-05.mp3"
// ];
var bounces = [
  "bounce-1.mp3",
  "bounce-2.mp3",
  "bounce-3.mp3"
];

var hits = [
  "hit-1.mp3",
  "hit-2.mp3",
  "hit-3.mp3",
  "hit-4.mp3",
  "hit-5.mp3"
];



module.exports = function(ecs, game) { // eslint-disable-line no-unused-vars
  ecs.add(function(entities, elapsed) { // eslint-disable-line no-unused-vars
    collide(game, constants.player1, constants.player2);
    collide(game, constants.player1, constants.ball);
    collide(game, constants.player2, constants.ball);

    keepOnCourt(game, constants.player1, 0.9);
    keepOnCourt(game, constants.player2, 0.9);
    keepInSides(game, constants.ball, 1);
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
  if (distSq >= collisionDistance * collisionDistance) {
    return;
  }

  var ball = game.entities.getComponent(a, "ball") || game.entities.getComponent(b, "ball");
  if (ball) { game.sounds.play(random.from(hits)); }

  var toMove = collisionDistance - Math.sqrt(distSq);
  var angle = Math.atan2(positionA.y - positionB.y, positionA.x - positionB.x);
  positionA.x += (toMove * Math.cos(angle));
  positionA.y += (toMove * Math.sin(angle));

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

function keepOnCourt(game, entity, elasticity) {
  var courtPos = game.entities.getComponent(constants.court, "position");
  var courtSize = game.entities.getComponent(constants.court, "size");
  var courtTop = courtPos.y - (courtSize.height / 2);
  var courtBottom = courtTop + courtSize.height;

  var position = game.entities.getComponent(entity, "position");
  var circle = game.entities.getComponent(entity, "circle");
  var velocity = game.entities.getComponent(entity, "velocity");

  if (position.y - circle.radius < courtTop) {
    position.y = courtTop + circle.radius;
    if (velocity.y < 0) {
      velocity.y *= -1 * elasticity;
    }
  }
  if (position.y + circle.radius > courtBottom) {
    position.y = courtBottom - circle.radius;
    if (velocity.y > 0) {
      velocity.y *= -1 * elasticity;
    }
  }

  keepInSides(game, entity, elasticity);
}

function keepInSides(game, entity, elasticity) {
  var courtPos = game.entities.getComponent(constants.court, "position");
  var courtSize = game.entities.getComponent(constants.court, "size");
  var courtLeft = courtPos.x - (courtSize.width / 2);
  var courtRight = courtLeft + courtSize.width;

  var position = game.entities.getComponent(entity, "position");
  var circle = game.entities.getComponent(entity, "circle");
  var velocity = game.entities.getComponent(entity, "velocity");
  var ball = game.entities.getComponent(entity, "ball");

  if (position.x - circle.radius < courtLeft) {
    if (ball) { game.sounds.play(random.from(bounces)); }
    position.x = courtLeft + circle.radius;
    if (velocity.x < 0) {
      velocity.x *= -1 * elasticity;
    }
  }
  if (position.x + circle.radius > courtRight) {
    if (ball) { game.sounds.play(random.from(bounces)); }
    position.x = courtRight - circle.radius;
    if (velocity.x > 0) {
      velocity.x *= -1 * elasticity;
    }
  }
}

function checkScore(game, entity) {
  var courtPos = game.entities.getComponent(constants.court, "position");
  var courtSize = game.entities.getComponent(constants.court, "size");
  var courtTop = courtPos.y - (courtSize.height / 2);
  var courtBottom = courtTop + courtSize.height;

  var position = game.entities.getComponent(entity, "position");
  var circle = game.entities.getComponent(entity, "circle");
  var score = game.entities.getComponent(constants.score, "score");



  var networkRole = game.entities.getComponent(constants.network, "network").role;


  var youArePlayer1 = networkRole === "server";

  if (position.y < courtTop - circle.radius) {
    console.log("player 1 scored");
    game.sounds.play("goal.mp3");
    if (youArePlayer1) {
      game.sounds.play("score-player-1.mp3");
    } else {
      game.sounds.play("fail.mp3");
    }
    score.player1++;
    reset(game);
  }
  if (position.y > courtBottom + circle.radius) {
    console.log("player 2 scored");
    game.sounds.play("goal.mp3");
    if (youArePlayer1) {
      game.sounds.play("fail.mp3");
    } else {
      game.sounds.play("score-player-1.mp3");
    }
    score.player2++;
    reset(game);
  }
}
