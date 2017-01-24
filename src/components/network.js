module.exports = {
  factory: function() {
    return {
      lastPacketTime: 0,
      packetRate: 50,
      peerTime: 0,
      role: "server",
      state: "disconnected",
      time: 0
    };
  },
  reset: function(network) {
    network.lastPacketTime = 0;
    network.packetRate = 50;
    network.peerTime = 0;
    network.role = "server";
    network.state = "disconnected";
    network.time = 0;
  }
};
