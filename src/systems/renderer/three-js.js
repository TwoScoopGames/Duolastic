var THREE = require("three");

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

function makeMesh(name, options) { // eslint-disable-line no-unused-vars
  switch (name) {
  case "cylinder":
    return makeCylinder(options);
  case "box":
  default:
    return makeBox(options);
  }
}

function makeCylinder(options) {
  var radiusTop = options.radiusTop;
  if (radiusTop === undefined) {
    radiusTop = 1;
  }
  var radiusBottom = options.radiusBottom;
  if (radiusBottom === undefined) {
    radiusBottom = 1;
  }
  var height = options.height;
  if (height === undefined) {
    height = 1;
  }
  var radiusSegments = options.radiusSegments;
  if (radiusSegments === undefined) {
    radiusSegments = 64;
  }
  var color = options.color;
  if (typeof color === "string") {
    color = parseInt(color, 16);
  }
  if (color === undefined) {
    color = 0xffffff;
  }

  var geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radiusSegments);
  var material = new THREE.MeshBasicMaterial({ color: color });
  var mesh = new THREE.Mesh(geometry, material);

  mesh.quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2);

  return mesh;
}

function makeBox(options) { // eslint-disable-line no-unused-vars
  var width = options.width;
  if (width === undefined) {
    width = 1;
  }
  var height = options.height;
  if (height === undefined) {
    height = 1;
  }
  var depth = options.depth;
  if (depth === undefined) {
    depth = 1;
  }
  var color = options.color;
  if (typeof color === "string") {
    color = parseInt(color, 16);
  }
  if (color === undefined) {
    color = 0xffffff;
  }

  var geometry = new THREE.BoxGeometry(width, height, depth);
  var material = new THREE.MeshBasicMaterial({ color: color });
  return new THREE.Mesh(geometry, material);
}
