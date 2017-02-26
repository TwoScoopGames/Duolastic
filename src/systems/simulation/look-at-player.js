var constants = require("../../constants");
var math2d = require("splat-ecs/lib/math2d");
var THREE = require("three");

module.exports = function(ecs, game) { // eslint-disable-line no-unused-vars
  ecs.addEach(function(entity, elapsed) { // eslint-disable-line no-unused-vars
    var network = game.entities.getComponent(entity, "network");
    if (network.state !== "connected") {
      return;
    }
    if (network.role === "server") {
      moveCamera(game, 900, Math.PI / 8, constants.player1);
    } else {
      moveCamera(game, 900, 7 * Math.PI / 8, constants.player2);
    }
  }, "network");
};

function moveCamera(game, distance, angle, follow) {
  var courtPosition = game.entities.getComponent(constants.court, "position");
  var courtModel = game.entities.getComponent(constants.court, "model");

  var position = game.entities.getComponent(constants.camera, "position");
  position.x = courtPosition.x;
  position.y = courtPosition.y + (distance * Math.cos(angle));
  position.z = courtPosition.z + (distance * Math.sin(angle)) + (courtModel.options.depth / 2);

  var followPosition = game.entities.getComponent(follow, "position");
  var followAngle = Math.atan2(followPosition.y - courtPosition.y, followPosition.x - courtPosition.x);
  var dist = Math.sqrt(math2d.distanceSquared(followPosition.x, followPosition.y, courtPosition.x, courtPosition.y)) * 0.1;

  var followX = courtPosition.x + (dist * Math.cos(followAngle));
  var followY = courtPosition.y + (dist * Math.sin(followAngle));
  var followZ = courtPosition.z + (courtModel.options.depth / 2);

  var quaternion = game.entities.getComponent(constants.camera, "quaternion");
  var model = game.entities.getComponent(constants.camera, "model");
  model.mesh.lookAt(new THREE.Vector3(followX, followY, followZ));
  model.mesh.up.set(0, 0, 1);
  quaternion.x = model.mesh.quaternion.x;
  quaternion.y = model.mesh.quaternion.y;
  quaternion.z = model.mesh.quaternion.z;
  quaternion.w = model.mesh.quaternion.w;
}
