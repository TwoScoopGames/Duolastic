
module.exports = {

  transparent: "rgba(0,0,0,0)",

  restrictToPercent: function(num) {
    if (num < 0 || isNaN(num)) {
      return 0;
    }
    if (num > 1) {
      return 1;
    }
    return num;
  },

  restrictPositive: function(num) {
    if (num < 0 || isNaN(num)) {
      console.log("SHIT - A RADIUS WENT BELOW 0");
      return 0;
    }
    return num;
  },

  inner: function(ctx, x, y, radius, shadowColor, shadowSpread) {
    if (shadowSpread <= 0) {
      return;
    }
    try {
      var radgrad = ctx.createRadialGradient(x, y, this.restrictPositive(radius), x, y, 0);

      radgrad.addColorStop(0, this.transparent);
      var stop = Math.max(radius - shadowSpread, 0) / radius;
      radgrad.addColorStop(stop, this.transparent);
      radgrad.addColorStop(0.99, shadowColor);
      radgrad.addColorStop(1, this.transparent);

      ctx.fillStyle = radgrad;
      ctx.beginPath();
      //ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
      ctx.fillRect(x - radius,y - radius, radius * 2, radius * 2);
      ctx.fill();
    } catch (error) {
      console.error(error);
      console.log("x1:", x,"y1:",y,"r0", 0,"x2:", x,"y2:", y,"r1:", radius);
      debugger; //eslint-disable-line no-debugger
    }
  },

  outer: function(ctx, x, y, r, shadowColor, shadowSpread) {
    if (shadowSpread <= 0) {
      return;
    }
    var radius = r + shadowSpread;
    try {
      var radgrad = ctx.createRadialGradient(x, y, this.restrictPositive(radius), x, y, 0);

      var stop = 0;
      radgrad.addColorStop(stop,this.transparent);

      stop = Math.max(r, 0) / radius;
      radgrad.addColorStop(this.restrictToPercent(stop), shadowColor);

      stop += 0.0001;
      radgrad.addColorStop(this.restrictToPercent(stop), shadowColor);
      radgrad.addColorStop(1, this.transparent);

      ctx.fillStyle = radgrad;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
      ctx.fill();
    } catch (error) {
      console.error(error);
      console.log("x1:", x,"y1:",y,"r0", 0,"x2:", x,"y2:", y,"r1:", radius);
      debugger; //eslint-disable-line no-debugger
    }
  },

  both: function(ctx, x, y, radius, color, inset, insetColor, outset, outsetColor) {
    this.outer(ctx, x, y, radius, outsetColor, inset);
    this.inner(ctx, x, y, radius, insetColor, outset);
  }
};
