var Text = require('../models/Text');

/**
 * POST text
 */

exports.new = function(req, res) {
  var text = new Text({
    text: req.params.text,
    start_time: req.params.start_time,
    end_time: req.params.end_time,
    sentiment: null
  });
  text.save(function(err, text) {
    res.send(200, { "id": text.id });
  });
};
