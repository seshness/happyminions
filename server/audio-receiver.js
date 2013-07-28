// var io = require('socket.io').listen(9999);

// io.sockets.on('connection', function (socket) {
//   console.log('socket connected');
//   socket.on('', function (data) {
//     console.log(data);
//   });
// });

// var Audio = require('./models/Audio'),
//     WebSocketServer = require('ws').Server,
//     wss = new WebSocketServer({
//       port: 9999
//     });

// wss.on('connection', function(ws) {
//   ws.on('message', function(message) {
//     console.log(JSON.parse(message));
//     console.log(message.start_time, message.end_time, message.base64_audio);
//     // var audio = new Audio({
//     // });
//   });
// });

// var BinaryServer = require('binaryjs').BinaryServer;

// bs = new BinaryServer({
//   port: 9999
// });

// server.on('connection', function(client) {
//   client.on('stream', function(stream, meta) {
//     console.log('receiving stream: %s', stream)
//     console.log('meta: %s', meta)
//   });
// });
