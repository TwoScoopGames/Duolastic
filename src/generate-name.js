var wordList = require("./data/word-lists");

module.exports = {
  username: function(generator) {
    var parts = [
      { list: wordList.prefixes, probability: 1 },
      { list: wordList.adjectives, probability: 0.5 },
      { list: wordList.firstnames, probability: 1 },
      { list: wordList.lastnames, probability: 1 }
    ];
    return generateName(generator, parts);
  },
  location: function(generator) {
    var parts = [
      { list: wordList.locationPrefixes, probability: 0.5 },
      { list: wordList.adjectives, probability: 1 },
      { list: wordList.locations, probability: 1 },
      { list: wordList.locationSuffixes, probability: 0.2 }
    ];
    return generateName(generator, parts);
  }
};

function randomInRange(generator, min, max) {
  return min + generator.random() * (max - min);
}

function randomFrom(generator, array) {
  return array[Math.floor(generator.random() * array.length)];
}

function generateName(generator, parts) {
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
