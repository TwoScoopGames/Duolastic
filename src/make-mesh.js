var THREE = require("three");

module.exports = function makeMesh(name, options) { // eslint-disable-line no-unused-vars
  switch (name) {
  case "cylinder":
    return makeCylinder(options);
  case "box":
  default:
    return makeBox(options);
  }
};

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

  // FIXME: this is a hack, should come from component
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
  var mesh = new THREE.Mesh(geometry, material);

  // FIXME: this is a hack, should come from component
  mesh.quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2);

  return mesh;


}
