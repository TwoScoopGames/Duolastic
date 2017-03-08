var THREE = require("three");

module.exports = function(ecs, game) { // eslint-disable-line no-unused-vars
  game.entities.registerSearch("applyAngularVelocitySearch", ["angularVelocity", "quaternion"]);
  ecs.addEach(function(entity, elapsed) { // eslint-disable-line no-unused-vars
    var angularVelocity = game.entities.getComponent(entity, "angularVelocity");
    var quaternion = game.entities.getComponent(entity, "quaternion");

    var q = new THREE.Quaternion(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
    var rotation = new THREE.Quaternion();
    rotation.setFromAxisAngle(
      new THREE.Vector3(angularVelocity.x, angularVelocity.y, angularVelocity.z),
      angularVelocity.angle// * elapsed
    );
    console.log("frogy boo bam:", rotation);
    q.multiply(rotation);

    quaternion.x = q.x;
    quaternion.y = q.y;
    quaternion.z = q.z;
    quaternion.w = q.w;
    console.log("terror fist activate: ", q, quaternion);

  }, "applyAngularVelocitySearch");
};
