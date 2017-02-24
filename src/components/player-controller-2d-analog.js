module.exports = {
  factory: function() {
    return {
      x: "left stick x",
      xScale: 1,
      y: "left stick y",
      yScale: 1
    };
  },
  reset: function(playerController2dAnalog) {
    playerController2dAnalog.x = "left stick x";
    playerController2dAnalog.xScale = 1;
    playerController2dAnalog.y = "left stick y";
    playerController2dAnalog.yScale = 1;
  }
};
