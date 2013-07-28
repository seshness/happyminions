$(function() {
  function hasGetUserMedia() {
    return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia || navigator.msGetUserMedia);
  }

  if (!hasGetUserMedia()) {
    console.error('getUserMedia() is not supported in your browser');
  }

  // http://jsperf.com/blob-base64-conversion
  var blobToBase64_2 = function(blob, cb) {
    var reader = new FileReader();
    reader.onload = function() {
      var buffer = reader.result;
      // var view = new Uint8Array(buffer);
      cb(ArrayBufferToBase64(buffer));
      // var binary = String.fromCharCode.apply(window, view);
      // var base64 = btoa(binary);
      // cb(base64);
    };
    reader.readAsArrayBuffer(blob);
  };

  var context = new webkitAudioContext()

  var ws = new WebSocket('ws://localhost:9999');
  ws.binaryType = 'arraybuffer';
  ws.onopen = function() {
    console.log('opened connection to websocket');
  };

  var playbackQueue = [];

  var playFromAudioBuffer = function(buffer) {
    var sourceNode = context.createBufferSource();
    sourceNode.buffer = buffer;
    sourceNode.connect(context.destination);
    sourceNode.onended = function() {
      if (playbackQueue.length > 1) {
        console.log('playing next audio file')
        playFromAudioBuffer(playbackQueue.unshift());
      }
    };
    console.log('playing an audio file')
    sourceNode.start(0);
    return sourceNode;
  };

  // Play audio from websocket
  ws.onmessage = function(e) {
    context.decodeAudioData(e.data, function(buffer) {
      console.log('audio decoding success!')
      playbackQueue.push(buffer)
      playFromAudioBuffer(buffer);
      // if (playbackQueue.length === 1) {
      //   console.log('first audio file queueing')
      //   playFromAudioBuffer(playbackQueue.unshift());
      // }
    }, function(error) {
      console.warn('Audio decoding error', error)
    });
  };

  // success callback when requesting audio input stream
  var gotStream = function(stream) {
    var mediaStreamSource = context.createMediaStreamSource(stream),
        recorder = new Recorder(mediaStreamSource, {
          workerPath: '/js/recorderjs/recorderWorker.js'
        });

    recorder.record();

    // export a wav every second, so we can send it using websockets
    var intervalKey = setInterval(function() {
      recorder.exportWAV(function(blob) {
        recorder.clear();
        var data = {
          start_time: Math.floor(Date.now() - 1250),
          end_time: Math.ceil(Date.now())
        };
        blobToBase64_2(blob, function(base64) {
          data.base64_audio = base64;
          // ws.send(data);
          $.ajax({
            type: 'POST',
            url: '/audio',
            data: data,
            success: function() {
              // console.log('sent a blob of audio', data);
            }
          });
        });
      });
    }, 5000);
  };

  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
  navigator.getUserMedia({ audio: true }, gotStream);
});
