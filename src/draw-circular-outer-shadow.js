var config = require("./stack-config");

module.exports = function drawShadowCircle(ctx, x, y, r, color, spread) {
  var transparent = "rgba(0,0,0,0)";
  var radius = r + spread;
  var radgrad = ctx.createRadialGradient(x, y, 0, x, y, radius);

  var stop = 0;
  radgrad.addColorStop(stop, parseRGBA(color));
  if (spread > 0) {
    stop = Math.max(r, 0) / radius;
  } else {
    stop = Math.max(r, 0);
  }
  radgrad.addColorStop(restrictToPercent(stop), parseRGBA(color));

  stop += 0.0001;
  radgrad.addColorStop(restrictToPercent(stop), parseRGBA(color));
  radgrad.addColorStop(1, transparent);

  ctx.fillStyle = radgrad;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
  ctx.fill();
  if (config.debugLines) {
    ctx.strokeStyle = config.debugLineColor;
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


function restrictToPercent(num) {
  if (num < 0 || isNaN(num)) {
    return 0;
  }
  if (num > 1) {
    return 1;
  }
  return num;
}
