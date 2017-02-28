var courtHeight = 1000;
var courtWidthRatio = 0.75;
var puckDiameterRatio = 0.05;
var paddleDiameterRatio = 0.2;

module.exports = {
  camera: 0,
  player1: 2,
  player2: 3,
  ball: 4,
  score: 5,
  court: 6,

  player1ScoreText: 80,
  player2ScoreText: 81,
  courtWidth: courtHeight * courtWidthRatio,
  courtHeight: courtHeight,
  puckDiameter: courtHeight * puckDiameterRatio,
  paddleDiameter: courtHeight * paddleDiameterRatio,

  removeSegments: false,
  showScoreNumbers: false
};
