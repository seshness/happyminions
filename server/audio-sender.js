var WebSocketServer = require('ws').Server,
wss = new WebSocketServer({
    port: 9999
});

var connections = [];

wss.on('connection', function(ws) {
    connections.push(ws);
});

module.exports = function(audios) {
  audios.sort(function(a, b) {
    return (new Date(a.start_time)).getTime() - (new Date(b.start_time)).getTime();
  });
  for (var i = connections.length - 1; i >= 0; i--) {
    for (var j = 0; j <= audios.length - 1; j++) {
      connections[i].send(audios[j].audio);
    }
  }
};
