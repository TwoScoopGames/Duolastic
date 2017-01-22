
var config = {
  perspective: 0.5,
  offsetX: 2,
  offsetY: 32,
  shadowOffsetX: 1.2,
  shadowOffsetY: -6,
  outsetSize: 10,
  outsetColor: [0, 0, 0, 0.5],
  insetSize: 10,
  insetColor: [0, 0, 0, 1],
  debugLines: false,
  debugLineColor: [0, 0, 0, 1],
  colors: {
    "standard": [
      "rgba(62,88,137,0)",
      "rgba(76,128,175,1)",
      "rgba(85,188,221,1)",
      "rgba(147,213,186,1)",
      "rgba(228,240,128,1)",
      "rgba(249,229,114,1)",
      "rgba(255,207,92,1)",
      "rgba(255,156,31,1)",
      "rgba(241,81,57,1)",
      "rgba(198,55,47,1)",
      "rgba(142,40,62,1)",
      "rgba(89,49,75,1)"
    ],
    "inverted": [
      "rgba(89,49,75,1)",
      "rgba(142,40,62,1)",
      "rgba(198,55,47,1)",
      "rgba(241,81,57,1)",
      "rgba(255,156,31,1)",
      "rgba(255,207,92,1)",
      "rgba(249,229,114,1)",
      "rgba(228,240,128,1)",
      "rgba(147,213,186,1)",
      "rgba(85,188,221,1)",
      "rgba(76,128,175,1)",
      "rgba(62,88,137,0)"
    ]
  }
};

module.exports = function(ecs, game) { // eslint-disable-line no-unused-vars
  game.entities.registerSearch("drawCircleSearch", ["circle", "position"]);
  ecs.addEach(function(entity, elapsed) { // eslint-disable-line no-unused-vars
    var position = game.entities.getComponent(entity, "position");
    var circle = game.entities.getComponent(entity, "circle");

    var ball = game.entities.getComponent(entity, "ball");
    if (ball) {
      drawCircle(game.context, position.x, position.y, circle.radius, "rgba(50,50,50, 1)");
    } else {
      drawStack(game.context, position, circle);
    }
  }, "drawCircleSearch");
};

function drawStack(ctx, position, circle) {
  //console.log(circle.colorSet);
  if (circle.colorSet === "inverted") {
    colors = config.colors.inverted;
  }

  var centerX = position.x;
  var centerY = position.y;
  var colors = config.colors.standard;
  var onepart = circle.radius / colors.length;
  var newRadius = circle.radius;

  for (var i = 1; i < colors.length; i++) {
    newRadius -= onepart;
    var offsetX = centerX - (i * config.offsetX);
    var offsetY = centerY - (i * config.offsetY);

    var shadowOffsetX = offsetX - config.shadowOffsetX;
    var shadowOffsetY = offsetY - config.shadowOffsetY;

    ctx.setTransform(1,0,0,config.perspective,0,0);
    drawShadowCircle(ctx, shadowOffsetX, shadowOffsetY, newRadius, "rgba(0,0,0,1)", config.insetSize, config.insetColor, config.outsetSize, config.outsetColor);

    drawCircle(ctx, offsetX, offsetY, newRadius, colors[i]);

    ctx.setTransform(1,0,0,1,0,0);
  }
}

function drawCircle(ctx, x, y, radius, color) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
  ctx.fillStyle = color;
  ctx.fill();
}

function drawShadowCircle(ctx, x, y, r, color, inset, insetColor, outset, outsetColor) {
  var radius = r + outset;
  var radgrad = ctx.createRadialGradient(x, y, 0, x, y, radius);

  radgrad.addColorStop(0, parseRGBA(color));
  var stop = Math.max(r - inset, 0) / radius;
  radgrad.addColorStop(stop, parseRGBA(color));

  if (inset === 0 && outset === 0) {
    radgrad.addColorStop(1, colorWithZeroAlpha(color));
  }

  if (inset > 0) {
    if (outset === 0) {
      console.log("stop", stop);
      stop = 1 - 0.01;
      radgrad.addColorStop(stop, parseRGBA(insetColor));
      radgrad.addColorStop(1, colorWithZeroAlpha(insetColor));
    } else {
      stop += inset / radius;
      radgrad.addColorStop(stop, parseRGBA(insetColor));
    }
  }

  if (outset > 0) {
    stop += 0.0001;
    radgrad.addColorStop(stop, parseRGBA(outsetColor));
    radgrad.addColorStop(1, colorWithZeroAlpha(outsetColor));
  }

  ctx.fillStyle = radgrad;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
  ctx.fill();
  if (config.debugLines) {
    ctx.strokeStyle = parseRGBA(config.debugLineColor);
    ctx.strokeRect(x - radius, y - radius, radius * 2, radius * 2);
  }
}

function parseRGBA(colors) {
  if (typeof colors === "string") {
    return colors;
  }
  var c = [
    Math.round(colors[0]),
    Math.round(colors[1]),
    Math.round(colors[2]),
    colors[3]
  ];
  return "rgba(" + c.join(",") + ")";
}

function colorWithZeroAlpha(colors) {
  var c = [
    Math.round(colors[0]),
    Math.round(colors[1]),
    Math.round(colors[2]),
    0
  ];
  return "rgba(" + c.join(",") + ")";
}
