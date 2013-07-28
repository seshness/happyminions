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

  var counter = 0;

  var playbackQueue = [], hasEnded = true, fileQueue = [];
  window.playbackQueue = playbackQueue

  var playNext = function() {
    console.log('playNext!', Date.now())
    if (playbackQueue.length >= 1) {
      console.log('playing next audio file', Date.now())
      playFromAudioBuffer(playbackQueue.shift()[1]);
    } else {
      hasEnded = true;
    }
  };
  var playFromAudioBuffer = function(buffer) {
    var sourceNode = context.createBufferSource();
    // try {
      sourceNode.buffer = buffer;
      sourceNode.connect(context.destination);
      sourceNode.onended = playNext; // doesn't work? o.O :( ::( :(
      console.log('buffer.duration', buffer.duration)
      setTimeout(playNext, buffer.duration * 1100)
      console.log('playing an audio file', Date.now())
      sourceNode.start(0);
    // } catch (ex) {
    //   console.warn(ex)
    //   playNext();
    // }
    return sourceNode;
  };

  window.playFromAudioBuffer = playFromAudioBuffer

  var appendBuffer = function(buffer1, buffer2) {
    var tmp = new Uint8Array( buffer1.byteLength + buffer2.byteLength );
    tmp.set( new Uint8Array( buffer1 ), 0 );
    tmp.set( new Uint8Array( buffer2 ), buffer1.byteLength );
    return tmp.buffer;
  };

  var decode = function(genericBuffer) {
    context.decodeAudioData(genericBuffer, function(buffer) {
      console.log('decoded arraybuffer', Date.now())
      playbackQueue.push([counter++, buffer]);
      if (hasEnded) {
        hasEnded = false;
        console.log('first audio file going to play', Date.now());
        playFromAudioBuffer(playbackQueue.shift()[1]);
      }
    }, function(error) {
      console.warn('Audio decoding error', error, Date.now());
    });
  };

  var file = [];
  // Play audio from websocket
  ws.onmessage = function(e) {
    if (typeof e.data === 'string' && e.data === 'EOF') {
      var completeWav = file.reduce(appendBuffer);
      file.length = 0;
      console.log('EOF');
      decode(completeWav);
    } else {
      console.log('WebSocket: Received arraybuffer data');
      file.push(e.data);
    }
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
          start_time: Math.floor(Date.now() - 5000),
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
