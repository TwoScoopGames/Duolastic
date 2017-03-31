var ColorScheme = require("color-scheme");
var scheme = new ColorScheme();

var MarcelineTwister = require("mersenne-twister");
var generator = new MarcelineTwister();

module.exports = {
  palette: function(seed) {
    generator.init_seed(hashCode(seed));
    scheme.from_hue(randomInRange(generator, 1,256))
    /*
      mono (monochromatic)
      The monochromatic scheme is based on selecting a single hue on the color wheel, then adding more colors by varying the source color's saturation and brightness.
      4 colors will be produced.

      contrast
      Contrast supplements the selected hue with its complement (the color opposite it on the color wheel) as another source color.
      8 colors will be produced.

      triade
      Triade takes the selected hue and adds two more source colors that are both a certain distance from the initial hue.
      The distance() method can be used to specify how far additional source colors will be from the initial hue.
      12 colors will be produced.

      tetrade
      Tetrade adds another yet source color, meaning four total sources.
      16 colors will be produced.

      analogic
      Analogic produces colors that are "analogous", or next to each other on the color wheel.
      Increasing the distance distance() will push the colors away from each other. "Values between 0.25 and 0.5 (15-30 degrees on the wheel) are optimal."
      12 colors will be produced.
    */
          .scheme("analogic")
          .distance(0.75)
          .variation("default");   // default, pastel, soft, light, hard, pale

    var palette = scheme.colors();
    console.log(palette);
    return palette;
  }
};

function randomInRange(generator, min, max) {
  return min + generator.random() * (max - min);
}

// function randomFrom(generator, array) {
//   return array[Math.floor(generator.random() * array.length)];
// }


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

/*
0
:
"#11de00"
1
:
"#0a8500"
2
:
"#e7ffe6"
3
:
"#72ff66"
4
:
"#f70022"
5
:
"#940015"
6
:
"#ffe6e9"
7
:
"#ff667b"
8
:
"#ff7700"
9
:
"#994700"
10
:
"#fff1e6"
11
:
"#ffad66"
12
:
"#0078ab"
13
:
"#004867"
14
:
"#e6f7ff"
15
:
"#66d1ff"

*/

