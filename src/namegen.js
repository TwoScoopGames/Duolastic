var MersenneTwister = require('mersenne-twister');
var generator = new MersenneTwister();

var seed = 912121;
generator.init_seed(seed);
generator.random();

var random = {
  "inRange": function(min, max) {
    return min + generator.random() * (max - min);
  },
  "from": function(array) {
    return array[Math.floor(generator.random() * array.length)];
  }
};

module.exports = {
  location: generateLocation,
  username: generateUsername
}

var wordList = require("./data/word-lists");

function generateName(parts) {
  var names = [];
  for (var i = 0; i < parts.length; i++) {
    if (parts[i].probability) {
      if (random.inRange(0, 1) < parts[i].probability) {
        names.push(random.from(parts[i].list));
      }
    } else {
      names.push(random.from(parts[i].list));
    }
  }
  return names.join(" ");
}

function generateLocation() {
    return generateName(
    [
      { list: wordList.locationPrefixes, probability: 0.5 },
      { list: wordList.adjectives, probability: 1 },
      { list: wordList.locations, probability: 1 },
      { list: wordList.locationSuffixes, probability: 0.2 }
    ]
  )
}

function generateUsername() {
    return generateName(
      [
        { list: wordList.prefixes, probability: 1 },
        { list: wordList.adjectives, probability: 0.5 },
        { list: wordList.firstnames, probability: 1 },
        { list: wordList.lastnames, probability: 1 }
      ]
    );
}

console.log("Seed:", seed, "Username:", generateUsername() );