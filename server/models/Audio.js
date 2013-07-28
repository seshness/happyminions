var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  start_time: {
    type: Date,
    required: true
  },
  end_time: {
    type: Date,
    required: true
  },
  audio: {
    type: Buffer,
    required: true
  },
  contentType: String
});

var AudioModel = mongoose.model('Audio', schema);

module.exports = AudioModel;
