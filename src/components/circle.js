module.exports = {
  factory: function() {
    return {
      colorSet: [],
      mass: 10,
      radius: 100
    };
  },
  reset: function(circle) {
    circle.colorSet = [];
    circle.mass = 10;
    circle.radius = 100;
  }
};
