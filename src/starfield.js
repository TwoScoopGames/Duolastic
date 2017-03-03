var random = require("splat-ecs/lib/random");

module.exports = { // eslint-disable-line no-unused-vars
  spawn: function(game, options) {
    for (var i = 0; i < options.stars; i++) {
      var position = {};
      var cubeSides = getCubeSides(options.cube);
      position.x = random.inRange(cubeSides.left, cubeSides.right);
      position.y = random.inRange(cubeSides.top, cubeSides.bottom);
      position.z = random.inRange(cubeSides.front, cubeSides.back);
      this.createStar(game, position, options);
    }
  },
  createStar: function(game, position, options) {
    var newEntity = game.entities.create();

    var model = game.entities.addComponent(newEntity, "model");
    model.name = "sprite";
    model.options = {};

    model.options.color = "0xffffff";
    model.options.height = 64;
    model.options.width = 64;
    model.options.texture = options.image;

    var newPosition = game.entities.addComponent(newEntity, "position");
    newPosition.x = position.x;
    newPosition.y = position.y;
    newPosition.z = position.z;

    var velocity = game.entities.addComponent(newEntity, "velocity");
    velocity[options.direction] = options.velocity;

    game.entities.addComponent(newEntity, "size");

    var resetIfOutsideCube = game.entities.addComponent(newEntity, "resetIfOutsideCube");
    resetIfOutsideCube.origin = position;
    resetIfOutsideCube.cube = options.cube;

    return newEntity;
  }
};

function getCubeSides(cube) {
  var cubeSides = {};

  var half_of_box_width = cube.width / 2;
  cubeSides.left = cube.x - half_of_box_width;
  cubeSides.right = cube.x + half_of_box_width;

  var half_of_box_height = cube.height / 2;
  cubeSides.bottom = cube.y - half_of_box_height;
  cubeSides.top = cube.y + half_of_box_height;

  var half_of_box_depth = cube.depth / 2;
  cubeSides.back = cube.z - half_of_box_depth;
  cubeSides.front = cube.z + half_of_box_depth;

  return cubeSides;
}
