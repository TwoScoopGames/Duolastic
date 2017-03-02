module.exports = {
  factory: function() {
    return {
      origin: {
        "x": 0,
        "y": 0,
        "z": 0
      },
      cube: {
        "width": 100,
        "height": 100,
        "depth": 100,
        "x": 0,
        "y": 0,
        "z": 0
      }
    };
  },
  reset: function(resetIfOutsideCube) {
    resetIfOutsideCube.origin.x = 0;
    resetIfOutsideCube.origin.y = 0;
    resetIfOutsideCube.origin.z = 0;
    resetIfOutsideCube.cube.width = 100;
    resetIfOutsideCube.cube.height = 100;
    resetIfOutsideCube.cube.depth = 100;
    resetIfOutsideCube.cube.x = 0;
    resetIfOutsideCube.cube.y = 0;
    resetIfOutsideCube.cube.z = 0;
  }
};
