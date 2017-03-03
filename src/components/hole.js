module.exports = {
  factory: function() {
    return {
      active: false,
      hasBall: false,
      input: "hole",
    };
  },
  reset: function(hole) {
    hole.active = false;
    hole.hasBall = false;
    hole.input = "hole";
  }
};
