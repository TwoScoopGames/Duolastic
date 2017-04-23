module.exports = {
  factory: function() {
    return {
      parentId: null
    };
  },
  reset: function(childOf) {
    childOf.parentId = null;
  }
};
