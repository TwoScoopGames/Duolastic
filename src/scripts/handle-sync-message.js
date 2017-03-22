var deserialize = require("../serialize").deserialize;

module.exports = function(game, msg) {
  var entities = msg.entities || [];
  for (var j = 0; j < entities.length; j++) {
    deserialize(game, entities[j]);
  }
};
