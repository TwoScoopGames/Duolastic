
module.exports = {
  factory: function() {
    return {
      name: undefined,
      options: {},
      mesh: undefined
    };
  },
  reset: function(model) {
    model.name = undefined;
    model.options = {};
    model.mesh = undefined;
  }
};
