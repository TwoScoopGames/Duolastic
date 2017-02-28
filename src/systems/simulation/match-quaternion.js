module.exports = function(ecs, game) {
  ecs.addEach(function matchParent(entity) {
    var matchQuaternion = game.entities.getComponent(entity, "matchQuaternion");

    var parentQuaternion = game.entities.getComponent(matchQuaternion.id, "quaternion");
    if (parentQuaternion === undefined) {
      return;
    }
    console.log("parentQuaternion", parentQuaternion);
    console.log("quaternion", quaternion);
    var quaternion = game.entities.addComponent(entity, "quaternion");
    quaternion.x = parentQuaternion.x + matchQuaternion.offsetX;
    quaternion.y = parentQuaternion.y + matchQuaternion.offsetY;
    quaternion.z = parentQuaternion.z + matchQuaternion.offsetZ;
    quaternion.w = parentQuaternion.w + matchQuaternion.offsetW;
    console.log("quaternion", quaternion);
  }, "matchQuaternion");
};
