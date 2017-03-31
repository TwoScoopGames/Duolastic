var MarcelineTwister = require("mersenne-twister");
var generator = new MarcelineTwister();
var wordList = require("./data/word-lists");

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
  generator.init_seed(hashCode(seed));
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
