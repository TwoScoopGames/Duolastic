module.exports = {
  factory: function() {
    return {
      x: 0,
      y: 0,
      z: 0,
      angle: 0,
    };
  },
  reset: function(angularVelocity) {
    angularVelocity.x = 0;
    angularVelocity.y = 0;
    angularVelocity.z = 0;
    angularVelocity.angle = 0;
  }
};
