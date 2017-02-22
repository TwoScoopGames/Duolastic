var THREE = require("three");
var makeMesh = require("../../make-mesh");

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
//renderer.shadowMapEnabled = true;
//renderer.shadowMapType = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

var oldCanvas = document.getElementById("canvas");
oldCanvas.parentNode.removeChild(oldCanvas);

module.exports = function(ecs, game) { // eslint-disable-line no-unused-vars
  var scene = new THREE.Scene();

  threePointsLighting(scene);

  ecs.addEach(function(entity, elapsed) { // eslint-disable-line no-unused-vars
    var model = game.entities.getComponent(entity, "model");
    if (model.mesh !== undefined) {
      return;
    }
    model.mesh = makeMesh(model.name, model.options);

    model.mesh.castShadow = model.castShadow;
    console.log("model.mesh.castShadow", model.mesh.castShadow);
    model.mesh.receiveShadow = model.receiveShadow;
    console.log("model.mesh.receiveShadow", model.mesh.receiveShadow);

    scene.add(model.mesh);

    // FIXME: this is kinda gross
    // if (model.mesh.target) {
    //   scene.add(model.mesh.target);
    // }

  }, "model");

  game.entities.registerSearch("updateModelPosition", ["model", "position"]);
  ecs.addEach(function(entity, elapsed) { // eslint-disable-line no-unused-vars
    var model = game.entities.getComponent(entity, "model");
    var position = game.entities.getComponent(entity, "position");
    model.mesh.position.x = position.x;
    model.mesh.position.y = position.y;
    model.mesh.position.z = position.z;
  }, "updateModelPosition");

  game.entities.registerSearch("updateModelQuaternion", ["model", "quaternion"]);
  ecs.addEach(function(entity, elapsed) { // eslint-disable-line no-unused-vars
    var model = game.entities.getComponent(entity, "model");
    var quaternion = game.entities.getComponent(entity, "quaternion");
    model.mesh.quaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
  }, "updateModelQuaternion");

  ecs.add(function(entities, elapsed) { // eslint-disable-line no-unused-vars
    var cameras = game.entities.find("camera");
    if (cameras.length > 0) {
      var camera = cameras[0];
      var model = game.entities.getComponent(camera, "model");
      renderer.render(scene, model.mesh);
    }
  });


};


function threePointsLighting(scene) {
  var ambientLight = new THREE.AmbientLight(0x101010);
  ambientLight.name	= "Ambient light";
  ambientLight.castShadow = true;

  scene.add(ambientLight);
  //
  // var backLight = new THREE.DirectionalLight("white", 0.55);
  // backLight.position.set(0,-500,30);
  // backLight.castShadow = true;
  // backLight.name	= "Back light";
  //
  // scene.add(backLight);
  //
  // var keyLight = new THREE.DirectionalLight("white", 0.375);
  // keyLight.position.set(-375, 500, 30);
  // keyLight.castShadow = true;
  // keyLight.name = "Key light";
  //
  // scene.add(keyLight);
  //
  // var fillLight = new THREE.DirectionalLight("white", 0.25);
  // fillLight.position.set(375, 500, 30);
  //
  // fillLight.name	= "Fill light";
  // fillLight.castShadow = true;
  // scene.add(fillLight);

}
