module.exports = {
  factory: function() {
    return {
      x: 0,
      y: 0,
      z: 0,
      w: 1
    };
  },
  reset: function(quaternion) {
    quaternion.x = 0;
    quaternion.y = 0;
    quaternion.z = 0;
    quaternion.w = 1;
  }
};
