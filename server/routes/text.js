var Text = require('../models/Text'),
    exec = require('child_process').exec;

/**
 * POST text
 */

exports.create = function(req, res) {
  console.log(req.body);
  var text = new Text({
    text: req.body.text,
    start_time: req.body.start_time,
    end_time: req.body.end_time,
    sentiment: req.body.DEBUG === 'TRUE' ? req.body.sentiment : null,
    sentiment_type: null
  });
  text.save(function(err, text) {
    if (err) {
      console.error(err);
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
    .where('sentiment').gt(0.15).exec(function(err, texts) {
      texts = texts.sort(function(a, b) {
        return (new Date(b.start_time)).getTime() - (new Date(a.start_time)).getTime();
      });
      texts = texts.slice(0, 10);
      res.send(200, {
        "texts": texts
      });
  });
};

exports.allTexts = function(req, res) {
  Text.find({}).exec(function(err, texts) {
    res.send(200, {
      "texts": texts
    });
  });
};
