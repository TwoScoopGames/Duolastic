var config = require("../../stack-config");
var constants = require("../../constants");
var coordinateToScreen = require("../../coordinate-to-screen");
var shadow = require("../../shadow");

module.exports = function(ecs, game) { // eslint-disable-line no-unused-vars
  game.entities.registerSearch("drawCircleSearch", ["circle", "position"]);

  function compareHeight(a, b) {
    var positionA = game.entities.getComponent(a, "position");
    var positionB = game.entities.getComponent(b, "position");
    return positionA.y - positionB.y;
  }

  ecs.add(function(entities, elapsed) { // eslint-disable-line no-unused-vars
    var player = game.entities.getComponent(constants.network, "network").player;

    game.context.setTransform(1, 0, 0, 1, constants.screenWidth / 2, 0);
    game.context.strokeStyle = "#ff0000";
    drawPerspectiveLines(game.context, field, player);
    drawPerspectiveLines(game.context, centerLine, player);

    var toDraw = game.entities.find("drawCircleSearch").sort(compareHeight);
    if (player === 2) {
      toDraw.reverse();
    }
    for (var i = 0; i < toDraw.length; i++) {
      draw(game, toDraw[i], player);
    }

    game.context.setTransform(1, 0, 0, 1, 0, 0);
  }, "drawCircleSearch");
};

var field = [
  0, 0,
  0, constants.screenHeight,
  constants.screenWidth, constants.screenHeight,
  constants.screenWidth, 0,
  0, 0,
];
var centerLine = [
  0, constants.screenHeight / 2,
  constants.screenWidth, constants.screenHeight / 2,
];


function drawPerspectiveLines(context, points, player) {
  context.beginPath();
  for (var i = 0; i < points.length - 1; i += 2) {
    var p1 = coordinateToScreen(points[i + 0], points[i + 1], player);
    if (i === 0) {
      context.moveTo(p1.x, p1.y);
    } else {
      context.lineTo(p1.x, p1.y);
    }
  }

  var grd = context.createLinearGradient(150.000, 0.000, 150.000, 300.000);
  grd.addColorStop(0.000, "rgba(196, 194, 194, 1.000)");
  grd.addColorStop(0.398, "rgba(255, 255, 255, 1.000)");
  grd.addColorStop(1.000, "rgba(255, 255, 255, 1.000)");
  context.fillStyle = grd;

  context.fill();
  context.strokeStyle = "rgba(196, 194, 194, 1.000)";
  context.stroke();
}


function draw(game, entity, player) {
  var position = game.entities.getComponent(entity, "position");
  position = coordinateToScreen(position.x, position.y, player);
  var circle = game.entities.getComponent(entity, "circle");

  var ball = game.entities.getComponent(entity, "ball");
  var debug = game.entities.getComponent(entity, "debug");

  if (ball) {
    drawBall(game.context, position, circle);
  } else {
    drawStack(game, position, circle, entity, player);
  }
  if (debug) {
    drawCircle(game.context, position.x, position.y, circle.radius, "rgba(255, 0, 0, 0.5)");
  }
}

function getLength(point1, point2) {
  return Math.sqrt((point1.x - point2.x) * (point1.x - point2.x) + (point1.y - point2.y) * (point1.y - point2.y));
}


function drawStack(game, position, circle, entity, player) {
  var ctx = game.context;

  var colors = config.colors[circle.colorSet];
  var onepart = circle.radius / colors.length;
  var newRadius = circle.radius;
  var child = game.entities.find("follow").filter(function(id) {
    var follow = game.entities.getComponent(id, "follow");
    return follow.id === entity;
  })[0];
  if (!child) {
    debugger; //eslint-disable-line no-debugger
  }
  var childPosition = game.entities.getComponent(child, "position");
  childPosition = coordinateToScreen(childPosition.x, childPosition.y, player);
  var length = getLength(position, childPosition);
  var angle = Math.atan2(childPosition.y - position.y, childPosition.x - position.x);

  for (var i = 1; i < colors.length; i++) {
    var segment = (length / colors.length) * i;

    var offsetX = position.x + (segment * Math.cos(angle));
    var offsetY = position.y + (segment * Math.sin(angle));

    newRadius -= onepart;

    var shadowOffsetX = offsetX - config.shadowX;
    var shadowOffsetY = offsetY - config.shadowY;

    var x = (constants.screenWidth / 2) + shadowOffsetX;
    var r = radiusInPerspective(newRadius, x, shadowOffsetY);
    ctx.setTransform(1, 0, 0, config.perspective, x, shadowOffsetY);

    shadow.outer(
      ctx,
      shadowOffsetX,
      shadowOffsetY,
      restrictPositive(r + config.shadowRadiusModifier),
      config.shadowColor,
      config.shadowSpread
    );

    x = (constants.screenWidth / 2) + offsetX;
    r = radiusInPerspective(newRadius, x, shadowOffsetY);
    ctx.setTransform(1, 0, 0, config.perspective, x, offsetY);

    drawCircle(ctx, 0, 0, r, colors[i]);

    ctx.setTransform(1, 0, 0, 1, (constants.screenWidth / 2), 0);
  }
}

function radiusInPerspective(radius, x, y) {
  var left = coordinateToScreen(x - radius, y, 1);
  var right = coordinateToScreen(x + radius, y, 1);
  return (right.x - left.x) / 2;
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
  config.color = "rgba(118, 118, 118, 1)";
  config.insetColor = "rgba(50, 50, 50, 1)";
  config.outsetColor = "rgba(0, 0, 0, 0.5)";
  config.highlightColor = "rgba(190, 190, 190, 1)";
  config.highlightInsetColor = "rgba(118, 118, 118, 1)";
  config.highlightOutsetColor = "rgba(118, 118, 118, 1)";
  config.shadowColor = "rgba(0, 0, 0, 0.5)";
  config.shadowOutsetColor = "rgba(0, 0, 0, 0.5)";
  config.shadowInsetColor = "rgba(0, 0, 0, 0.5)";
  config.debugLines = false;
  config.debugLineColor = "rgba(0, 0, 0, 1)";


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


  ctx.setTransform(1, 0, 0, 1, constants.screenWidth / 2, 0);
  shadow.both(ctx,
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

  ctx.setTransform(1, 0, 0, config.perspective, constants.screenWidth / 2, 0);
  shadow.both(ctx,
        hightlightOffsetX,
        hightlightOffsetY,
        config.highlightRadius,
        config.highlightColor,
        config.highlightInsetSize,
        config.highlightInsetColor,
        config.highlightOutsetSize,
        config.highlightOutsetColor);
}

function restrictPositive(num) {
  if (num < 0 || isNaN(num)) {
    return 0;
  }
  return num;
}
