module.exports = function(ecs, game) { // eslint-disable-line no-unused-vars
  game.entities.registerSearch("lineToParentSearch", ["circle", "follow"]);
  ecs.addEach(function(entity, elapsed) { // eslint-disable-line no-unused-vars
    var position = game.entities.getComponent(entity, "position");
    var follow = game.entities.getComponent(entity, "follow");
    var parentPosition = game.entities.getComponent(follow.id, "position");


    drawLine (game.context, position, parentPosition, "purple");



  }, "lineToParentSearch");
};


function drawLine(context, start, end, color) {
  context.beginPath();
  context.moveTo(start.x, start.y);
  context.lineTo(end.x, end.y);
  context.strokeStyle = color;
  context.stroke();
}
