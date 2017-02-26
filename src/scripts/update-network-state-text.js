var constants = require("../constants");

module.exports = function(entity, game) {
  var network = game.entities.getComponent(constants.network, "network");
  var networkStateModel = game.entities.getComponent(constants.networkStateText, "model");
  if (networkStateModel.options.text != network.state) {
    networkStateModel.needsUpdate = true;
    networkStateModel.options.text = network.state;
  }
};
