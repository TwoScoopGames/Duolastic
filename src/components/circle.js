module.exports = {
  factory: function() {
    return {
      mass: 10,
      radius: 100
    };
  },
  reset: function(circle) {
    circle.mass = 10;
    circle.radius = 100;
  }
};
