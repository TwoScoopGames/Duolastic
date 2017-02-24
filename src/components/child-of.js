module.exports = {
  factory: function() {
    return {
      parent: null,
      nth: 0
    };
  },
  reset: function(childOf) {
    childOf.parent = null;
    childOf.nth = 0;
  }
};
