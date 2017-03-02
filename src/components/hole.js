module.exports = {
  factory: function() {
    return {
      active: false,
      input: "action",
    };
  },
  reset: function(hole) {
    hole.active = false;
    hole.input = "action";
  }
};
