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
    drawBall(game.context, position, circle);
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



function drawBall(ctx, position, circle) {

  var config = {};
  config.x = position.x;
  config.y = position.y;
  config.radius = circle.radius;
  config.color = [118, 118, 118, 1];
  config.insetColor = [50, 50, 50, 1];
  config.outsetColor = [0, 0, 0, 0.5];
  config.highlightColor = [190, 190, 190, 1];
  config.highlightInsetColor = [118, 118, 118, 1];
  config.highlightOutsetColor = [118, 118, 118, 1];
  config.shadowColor = [0, 0, 0, 0.8];
  config.shadowOutsetColor = [0, 0, 0, 0.8];
  config.shadowInsetColor = [0, 0, 0, 0.8];
  config.debugLines = false;
  config.debugLineColor = [0, 0, 0, 1];


  config.insetSize = config.radius * 0.46;
  config.outsetSize = 0;
  config.hightlightOffsetY = config.radius * -0.24;
  config.highlightRadius = config.radius * 0.48;
  config.hightlightOffsetX = config.radius * 0.18,
  config.highlightInsetSize = config.radius * 0.36;
  config.highlightOutsetSize = config.radius * 0.3;
  config.shadowRadius = config.radius * 0.56;
  config.shadowOffsetX = 0;
  config.shadowOffsetY = config.radius * 5.48;
  config.shadowOutsetSize = config.radius * 0.4;
  config.shadowInsetSize = config.radius * 0.2;


  // var shadowOffsetX = config.x + config.shadowOffsetX;
  // var shadowOffsetY = config.y + config.shadowOffsetY;

  // ctx.setTransform(1, 0, 0, 0.5, 0, 0);
  // drawShadowCircle(ctx,
  //   shadowOffsetX,
  //   shadowOffsetY,
  //   config.shadowRadius,
  //   config.shadowColor,
  //   config.shadowInsetSize,
  //   config.shadowInsetColor,
  //   config.shadowOutsetSize,
  //   config.shadowOutsetColor);

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  drawShadowCircle(ctx,
      config.x,
      config.y,
      config.radius,
      config.color,
      config.insetSize,
      config.insetColor,
      config.outsetSize,
      config.outsetColor);

  var hightlightOffsetX = config.x + config.hightlightOffsetX;
  var hightlightOffsetY = config.y + config.hightlightOffsetY;

  ctx.setTransform(1, 0, 0, config.perspective, 0, 0);
  drawShadowCircle(ctx,
        hightlightOffsetX,
        hightlightOffsetY,
        config.highlightRadius,
        config.highlightColor,
        config.highlightInsetSize,
        config.highlightInsetColor,
        config.highlightOutsetSize,
        config.highlightOutsetColor);

}
