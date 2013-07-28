var Audio = require('../models/Audio'),
    sender = require('../audio-sender');

/**
 * POST audio
 */

exports.create = function(req, res) {
  binaryData = new Buffer(req.body.base64_audio, 'base64');
  // Verify that the file actually contains audio data
  // require("fs").writeFile("out.wav", binaryData, function(err) {
  //   if (err) console.log("error!", err); // writes out file without error, but it's not a valid image
  // });
  var audio = new Audio({
    audio: binaryData,
    start_time: req.body.start_time,
    end_time: req.body.end_time
  });
  audio.save(function(err, audio) {
    if (err) {
      console.error(err);
      res.send(500, {
        "error": err
      });
    } else {
      res.send(200, { "id": audio.id });
    }
  });
};

exports.playBetween = function(req, res) {
  console.log(req.query)
  Audio //.find({})
    .where('start_time').gt(parseInt(req.query.start_time, 10))
    .where('end_time').lt(parseInt(req.query.end_time, 10))
    // .sort({start_time: 'asc'}) // DOESN'T WORK!!!
    .exec('find', function(err, audios) {
      console.log(audios)
      sender(audios);
      res.send(200);
    });
};

exports.save = function(req, res) {
  Audio.find({})
    .exec(function(err, audios) {
      for (var i = audios.length - 1; i >= 0; i--) {
        require("fs").writeFile("out_" + i + ".wav", audios[i].audio, function(err) {
          if (err) console.log("error!", err); // writes out file without error, but it's not a valid image
        });
      }
      res.send(200);
    });
};