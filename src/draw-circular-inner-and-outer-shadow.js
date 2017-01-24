var config = require("./stack-config");

module.exports = function drawShadowCircle(ctx, x, y, r, color, inset, insetColor, outset, outsetColor) {
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
};

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
