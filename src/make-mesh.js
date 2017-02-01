var THREE = require("three");

module.exports = function makeMesh(name, options) { // eslint-disable-line no-unused-vars
  switch (name) {
  case "camera":
    return makeCamera(options);
  case "cylinder":
    return makeCylinder(options);
  case "box":
  default:
    return makeBox(options);
  }
};

function makeCamera(options) {
  var fieldOfView = options.fieldOfView;
  if (fieldOfView === undefined) {
    fieldOfView = 75;
  }
  var aspectRatio = options.aspectRatio;
  if (aspectRatio === undefined) {
    aspectRatio = window.innerWidth / window.innerHeight;
  }
  var near = options.near;
  if (near === undefined) {
    near = 1;
  }
  var far = options.far;
  if (far === undefined) {
    far = 1000;
  }
  return new THREE.PerspectiveCamera(fieldOfView, aspectRatio, near, far);
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
  var mesh = new THREE.Mesh(geometry, material);

  return mesh;
}
