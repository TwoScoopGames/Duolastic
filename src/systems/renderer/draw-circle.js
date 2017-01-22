var config = require("../../stack-config");
var drawShadowCircle = require("../../draw-shadow-circle");

module.exports = function(ecs, game) { // eslint-disable-line no-unused-vars
  game.entities.registerSearch("drawCircleSearch", ["circle", "position"]);

  function compareHeight(a, b) {
    var positionA = game.entities.getComponent(a, "position");
    var positionB = game.entities.getComponent(b, "position");
    return positionA.y - positionB.y;
  }

  ecs.add(function(entities, elapsed) { // eslint-disable-line no-unused-vars
    var toDraw = game.entities.find("drawCircleSearch").sort(compareHeight);
    for (var i = 0; i < toDraw.length; i++) {
      draw(game, toDraw[i]);
    }
  }, "drawCircleSearch");
};

function draw(game, entity) {
  var position = game.entities.getComponent(entity, "position");
  var circle = game.entities.getComponent(entity, "circle");

  var ball = game.entities.getComponent(entity, "ball");
  if (ball) {
    drawCircle(game.context, position.x, position.y, circle.radius, "rgba(50, 50, 50, 1)");
  } else {
    drawStack(game.context, position, circle);
    // drawCircle(game.context, position.x, position.y, circle.radius, "rgba(255, 50, 50, 1)");
  }
}

function drawStack(ctx, position, circle) {
  var centerX = position.x;
  var centerY = position.y;
  var colors = config.colors[circle.colorSet];
  var onepart = circle.radius / colors.length;
  var newRadius = circle.radius;

  for (var i = 1; i < colors.length; i++) {
    newRadius -= onepart;
    var offsetX = centerX - (i * config.offsetX);
    var offsetY = centerY - (i * config.offsetY);

    var shadowOffsetX = offsetX - config.shadowOffsetX;
    var shadowOffsetY = offsetY - config.shadowOffsetY;

    ctx.setTransform(1, 0, 0, config.perspective, shadowOffsetX, shadowOffsetY);
    drawShadowCircle(ctx, 0, 0, newRadius, "rgba(0,0,0,1)", config.insetSize, config.insetColor, config.outsetSize, config.outsetColor);

    ctx.setTransform(1, 0, 0, config.perspective, offsetX, offsetY);
    drawCircle(ctx, 0, 0, newRadius, colors[i]);

    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
}

function drawCircle(ctx, x, y, radius, color) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
  ctx.fillStyle = color;
  ctx.fill();
}

