var THREE = require("three");
var makeMesh = require("../../make-mesh");

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var oldCanvas = document.getElementById("canvas");
oldCanvas.parentNode.removeChild(oldCanvas);

module.exports = function(ecs, game) { // eslint-disable-line no-unused-vars
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  camera.position.x = 500;
  camera.position.y = 300;
  camera.position.z = 1000;

  var topLightPosition = { x: 568, y: 320, z: 500 };
  var topLightTarget = { x: 568, y: 320, z: 0 };
  createLight(scene, "Top Light", "white", 1, topLightPosition, topLightTarget, false, 200);


  ecs.addEach(function(entity, elapsed) { // eslint-disable-line no-unused-vars
    var model = game.entities.getComponent(entity, "model");
    if (model.mesh !== undefined) {
      return;
    }
    console.log("make mesh");
    model.mesh = makeMesh(model.name, model.options);
    scene.add(model.mesh);
  }, "model");

  game.entities.registerSearch("updateModelPosition", ["model", "position"]);
  ecs.addEach(function(entity, elapsed) { // eslint-disable-line no-unused-vars
    var model = game.entities.getComponent(entity, "model");
    var position = game.entities.getComponent(entity, "position");
    model.mesh.position.x = position.x;
    model.mesh.position.y = position.y;
    model.mesh.position.z = position.z;
  }, "updateModelPosition");

  ecs.add(function(entities, elapsed) { // eslint-disable-line no-unused-vars
    renderer.render(scene, camera);
  });
};



function createLight(scene, name, color, intensity, position, targetPosition, shadows, helperSize) {
  var light = new THREE.DirectionalLight(color, intensity);
  light.name = name;
  light.castShadow = shadows;
  light.position.set(position.x, position.y, position.z);
  light.target.position.set(targetPosition.x, targetPosition.y, targetPosition.z);
  scene.add(light.target);
  scene.add(light);

  // var helper = new THREE.DirectionalLightHelper(light, helperSize);
  // scene.add(helper);
}
