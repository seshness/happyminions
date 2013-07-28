var mongoose = require('mongoose'),
    child_process = require('child_process'),
    request = require('request');

var textSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  start_time: Date,
  end_time: Date,
  sentiment: Number,
  sentiment_type: String
});

/**
 * REALLY REALLY HACKY REPLACE ASAP
 */
textSchema.methods.fetchSentiment = function() {
  var self = this;
  child_process.exec(
    'python ../sentiment_analysis/sentiment.py "' + this.text + '"',
    function(error, stdout, stderr) {
      var sentiment_results = JSON.parse(stdout);
      self.sentiment = sentiment_results.sentiment_score;
      self.sentiment_type = sentiment_results.sentiment_type;
      self.save();
    });
};

var Text = mongoose.model('Text', textSchema);

module.exports = Text;
