var random = require("splat-ecs/lib/random");

module.exports = function(ecs, game) {
  ecs.addEach(function controlPlayerHole(entity) {
    var position = game.entities.getComponent(entity, "position");
    var resetIfOutsideCube = game.entities.getComponent(entity, "resetIfOutsideCube");
    var cube = resetIfOutsideCube.cube;
    if (!insideCube(position, cube)) {
      //console.log("outside cube");
      position.x = random.inRange(cube.x - (cube.width / 2), cube.x + (cube.width / 2));
      position.y = random.inRange(cube.y - (cube.height / 2), cube.y + (cube.height / 2));
      position.z = random.inRange(cube.z - (cube.depth / 2), cube.z + (cube.depth / 2));
    }

  }, "resetIfOutsideCube");
};


function insideCube(position, box) {
  // var half_of_box_width = box.width / 2;
  // var minX = box.x - half_of_box_width;
  // var maxX = box.x + half_of_box_width;
  //
  // var half_of_box_height = box.height / 2;
  // var minY = box.y - half_of_box_height;
  // var maxY = box.y + half_of_box_height;

  var half_of_box_depth = box.depth / 2;
  //var minZ = box.z - half_of_box_depth;
  var maxZ = box.z + half_of_box_depth;

  return position.z < maxZ;
      // || position.z < minZ
      // || position.x < minX
      // || position.x < maxX
      //
      // || position.y < minY
      // || position.y < maxY;
}
