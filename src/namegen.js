var MarcelineTwister = require('mersenne-twister');
var generator = new MarcelineTwister();
var wordList = require("./data/word-lists");

var testSeed = 912121;

module.exports = {
  username: function(seed) {
    var parts = [
      { list: wordList.prefixes, probability: 1 },
      { list: wordList.adjectives, probability: 0.5 },
      { list: wordList.firstnames, probability: 1 },
      { list: wordList.lastnames, probability: 1 }
    ];
    return generateName(seed, parts);
  },
  location: function(seed) {
    var parts = [
      { list: wordList.locationPrefixes, probability: 0.5 },
      { list: wordList.adjectives, probability: 1 },
      { list: wordList.locations, probability: 1 },
      { list: wordList.locationSuffixes, probability: 0.2 }
    ];
    return generateName(seed, parts);
  }
};

function randomInRange(generator, min, max) {
  return min + generator.random() * (max - min);
}

function randomFrom(generator, array) {
  return array[Math.floor(generator.random() * array.length)];
}

function generateName(seed, parts) {
  generator.init_seed(seed);
  var names = [];
  for (var i = 0; i < parts.length; i++) {
    if (parts[i].probability) {
      if (randomInRange(generator, 0, 1) < parts[i].probability) {
        names.push(randomFrom(generator, parts[i].list));
      }
    } else {
      names.push(randomFrom(generator, parts[i].list));
    }
  }
  return names.join(" ");
}

console.log("Seed:", testSeed,
"\nUser:", module.exports.username(testSeed),
"\nLocation:", module.exports.location(testSeed)
);