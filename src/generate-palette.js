var convert = require("color-convert");

var colorSchemes = [
  splitComplementPlus
];

function randomInRangeSeed(generator, min, max) {
  return min + generator.random() * (max - min);
}

function randomFrom(generator, array) {
  return array[Math.floor(generator.random() * array.length)];
}

module.exports = {
  makePalette: function(generator) {
    var colorScheme = randomFrom(generator, colorSchemes);
    return colorScheme(generator);
  }
};



function splitComplementPlus(generator) {
  var hue = randomInRangeSeed(generator, 0, 360);
  var sat = randomInRangeSeed(generator, 90, 100);
  console.log("hue:", hue);
  var lum = randomInRangeSeed(generator, 35, 50);
  var lumStep = 4;
  var colors = [].concat(
    generateColorBand(hue, sat, lum += (lumStep * 2), lumStep, 0),
    generateColorBand(hue, sat, lum += (lumStep * 2), lumStep, 5),
    generateColorBand(hue, sat, lum += (lumStep * 2), lumStep, 6),
    generateColorBand(hue, sat, lum += (lumStep * 2), lumStep, 7)
  );
  console.log(colors);
  return colors;
}



// function rainbow() {
//
// }
//
// function triadic() {
//
// }
//
// function tetratic() {
//
// }


function generateColorBand(hue, sat, lum, lumStep, position) {
  return [
    generateColor(hue, sat, lum, position),
    generateColor(hue, sat, lum + lumStep, position),
    generateColor(hue, sat, lum + (lumStep * 2), position)
  ];
}

function generateColor(startingHue, s, l, position) {
  var h = startingHue + (360 * (position / 12));
  console.log(startingHue, s, l, position, h, convert.hsl.hex(h, s, l));
  return "0x" + convert.hsl.hex(h, s, l);
}
