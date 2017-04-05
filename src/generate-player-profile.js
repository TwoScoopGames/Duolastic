var MarcelineTwister = require("mersenne-twister");
var generateName = require("./generate-name");
var generatePalette = require("./generate-palette");


module.exports = function(seed) {
  var generator = new MarcelineTwister(hashCode(seed));
  console.log("seed:", seed, "\hashCode(seed):", hashCode(seed));
  return {
    username: generateName.username(generator),
    location: generateName.location(generator),
    palette: generatePalette.makePalette(generator)
  };
};


function hashCode(string) {
  var hash = 0, i, chr;
  if (string.length === 0) return hash;
  for (i = 0; i < string.length; i++) {
    chr   = string.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}
