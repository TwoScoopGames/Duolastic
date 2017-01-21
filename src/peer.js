var Peer = require("simple-peer");

module.exports = function createPeerConnection(callback) {
  if (!WebSocket) {
    callback("Your browser does not support WebSockets. Sorry :(");
    return;
  }
  if (!Peer.WEBRTC_SUPPORT) {
    callback("Your browser does not support WebRTC. Sorry :(");
    return;
  }

  var ws = new WebSocket(webSocketUrl("ws"));
  var peer;

  // ws.onopen = function() {
  //   console.log("websocket connected");
  // };
  ws.onerror = function(err) {
    console.error("websocket error", err);
  };
  ws.onmessage = function(msg) {
    // console.log("got message:", msg.data);
    if (!peer) {
      peer = new Peer({
        initiator: msg.data === "initiate",
        channelConfig: {
          ordered: false,
          maxRetransmits: 0
        }
      });
      peer.on("signal", function(data) {
        // console.log("got signalling data", JSON.stringify(data));
        ws.send(JSON.stringify(data));
      });
      peer.on("connect", function() {
        // console.log("got a connection");
        ws.close();
        callback(undefined, peer);
      });
    }
    if (msg.data !== "initiate") {
      peer.signal(JSON.parse(msg.data));
    }
  };
};

function webSocketUrl(s) {
  var l = window.location;
  var protocol = (l.protocol === "https:") ? "wss://" : "ws://";
  return protocol + l.host + l.pathname + s;
}
