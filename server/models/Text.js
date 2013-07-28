var mongoose = require('mongoose'),
    child_process = require('child_process'),
    request = require('request');

var Text = mongoose.model('Text', new mongoose.Schema({
  text: String,
  start_time: Date,
  end_time: Date,
  sentiment: Number,
  sentiment_type: String
}));

/**
 * REALLY REALLY HACKY REPLACE ASAP
 */
Text.methods.fetchSentiment = function() {
  child_process.exec(
    'python ../sentiment_analysis/sentiment.py "' + this.text + '"',
    function(error, stdout, stderr) {
      var sentiment_results = JSON.parse(stdout);
      this.sentiment = sentiment_results.sentiment_score;
      this.sentiment_type = sentiment_results.sentiment_type;
      this.save();
    });
};

module.exports = Text;
