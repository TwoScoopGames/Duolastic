var random = require("splat-ecs/lib/random");

module.exports = function(ecs, game) {
  ecs.addEach(function controlPlayerHole(entity) {
    var position = game.entities.getComponent(entity, "position");
    var resetIfOutsideCube = game.entities.getComponent(entity, "resetIfOutsideCube");
    var cube = resetIfOutsideCube.cube;
    if (!insideCube(position, cube)) {
      //console.log("escaped");
      position.x = random.inRange(cube.x - (cube.width / 2), cube.x + (cube.width / 2));
      position.y = random.inRange(cube.y - (cube.height / 2), cube.y + (cube.height / 2));
      position.z = random.inRange(cube.z - (cube.depth / 2), cube.z + (cube.depth / 2));
    }

  }, "resetIfOutsideCube");
};

/* right now this only works if stars exit the front of the cube */
function insideCube(position, cube) {
  return position.x > cube.left &&
         position.x < cube.right &&
         position.y > cube.top &&
         position.y < cube.bottom &&
         position.z > cube.back &&
         position.z < cube.front;
}
