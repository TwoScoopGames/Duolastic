module.exports = function(ecs, game) { // eslint-disable-line no-unused-vars
  game.entities.registerSearch("drawCircleSearch", ["circle", "position"]);
  ecs.addEach(function(entity, elapsed) { // eslint-disable-line no-unused-vars
    var position = game.entities.getComponent(entity, "position");
    var circle = game.entities.getComponent(entity, "circle");

    game.context.fillStyle = circle.fillStyle;
    game.context.beginPath();
    game.context.arc(position.x, position.y, circle.radius, 0, 2 * Math.PI, false);
    game.context.fill();

  }, "drawCircleSearch");
};
