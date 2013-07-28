var Text = require('../models/Text'),
    exec = require('child_process').exec;

/**
 * POST text
 */

exports.create = function(req, res) {
  var text = new Text({
    text: req.body.text,
    start_time: req.body.start_time,
    end_time: req.body.end_time,
    sentiment: req.body.DEBUG === 'TRUE' ? req.body.sentiment : null,
    sentiment_type: null
  });
  text.save(function(err, text) {
    if (err) {
      res.send(500, {
        "error": err
      });
    } else {
      res.send(200, { "id": text.id });
      text.fetchSentiment();
    }
  });
};

exports.happyTexts = function(req, res) {
  Text
    .where('sentiment_type').equals('positive')
    .where('sentiment').gt(0.1).exec(function(err, texts) {
    res.send(200, {
      "happyTexts": texts
    });
  });
};

exports.allTexts = function(req, res) {
  Text.find({}).exec(function(err, texts) {
    res.send(200, {
      "happyTexts": texts
    });
  });
};