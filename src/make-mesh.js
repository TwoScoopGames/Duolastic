var THREE = require("three");

module.exports = function makeMesh(name, options) { // eslint-disable-line no-unused-vars
  switch (name) {
  case "box":
  default:
    return makeBox(options);
  case "camera":
    return makeCamera(options);
  case "cylinder":
    return makeCylinder(options);
  case "directionalLight":
    return makeDirectionalLight(options);
  }
};

function makeBox(options) {
  var width = getOption(options.width, 1);
  var height = getOption(options.height, 1);
  var depth = getOption(options.depth, 1);
  var color = getColorOption(options.color, 0xffffff);

  var geometry = new THREE.BoxGeometry(width, height, depth);
  var material = new THREE.MeshLambertMaterial({ color: color });
  var mesh = new THREE.Mesh(geometry, material);

  return mesh;
}

function getOption(value, defaultValue) {
  if (value === undefined) {
    return defaultValue;
  }
  return value;
}

function getColorOption(color, defaultValue) {
  if (typeof color === "string" && color.indexOf("x") !== -1) {
    return parseInt(color, 16);
  }
  if (color === undefined) {
    return defaultValue;
  }
  return color;
}

function makeCamera(options) {
  var fieldOfView = getOption(options.fieldOfView, 75);
  var aspectRatio = getOption(options.aspectRatio, window.innerWidth / window.innerHeight);
  var near = getOption(options.near, 1);
  var far = getOption(options.far, 1000);
  return new THREE.PerspectiveCamera(fieldOfView, aspectRatio, near, far);
}

function makeCylinder(options) {
  var radiusTop = getOption(options.radiusTop, 1);
  var radiusBottom = getOption(options.radiusBottom, 1);
  var height = getOption(options.height, 1);
  var radiusSegments = getOption(options.radiusSegments, 64);
  var color = getColorOption(options.color, 0xffffff);

  var geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radiusSegments);
  var material = new THREE.MeshLambertMaterial({ color: color });
  var mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  return mesh;
}

function makeDirectionalLight(options) {
  var color = getColorOption(options.color, 0xffffff);
  var intensity = getOption(options.intensity, 1);
  var castShadow = getOption(options.castShadow, false);
  var targetX = getOption(options.targetX, 0);
  var targetY = getOption(options.targetY, 0);
  var targetZ = getOption(options.targetZ, 0);


  var light = new THREE.DirectionalLight(color, intensity);
  light.castShadow = castShadow;
  light.shadowDarkness = 1;
  light.target.position.set(targetX, targetY, targetZ);
  return light;
}
