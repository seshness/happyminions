var Text = require('../models/Text');

/**
 * POST text
 */

exports.new = function(req, res) {
  var text = new Text({
    text: req.body.text,
    start_time: req.body.start_time,
    end_time: req.body.end_time,
    sentiment: null
  });
  text.save(function(err, text) {
    res.send(200, { "id": text.id });
  });
};
