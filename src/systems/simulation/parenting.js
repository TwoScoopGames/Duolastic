
module.exports = function(ecs, game) {
  game.entities.registerSearch("parentingSearch", ["parentThis","childOf", "model"]);
  ecs.addEach(function(entity) {

    var childModel = game.entities.getComponent(entity, "model");


    if (childModel.mesh !== undefined) {
      var childMesh = childModel.mesh;

      var parent = game.entities.getComponent(entity, "childOf").parentId;

      var parentModel = game.entities.getComponent(parent, "model");

      if (parentModel.mesh !== undefined) {
        var parentMesh = parentModel.mesh;
      }

      parentMesh.add(childMesh);

    }


  }, "parentingSearch");
};
