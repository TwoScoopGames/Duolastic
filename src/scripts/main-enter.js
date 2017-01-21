"use strict";

var createPeerConnection = require("../peer");

module.exports = function(game) { // eslint-disable-line no-unused-vars
  createPeerConnection(function(err, peer) {
    if (err) {
      console.error(err);
      return;
    }
    console.log("got a peer", peer);
  });
};
