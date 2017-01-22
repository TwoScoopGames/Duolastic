module.exports = {
  factory: function() {
    return {
      player1: 0,
      player2: 0
    };
  },
  reset: function(score) {
    score.player1 = 0;
    score.player2 = 0;
  }
};
