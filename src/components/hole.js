module.exports = {
  factory: function() {
    return {
      active: false,
      hasBall: false,
      input: "action",
    };
  },
  reset: function(hole) {
    hole.active = false;
    hole.hasBall = false;
    hole.input = "action";
  }
};
