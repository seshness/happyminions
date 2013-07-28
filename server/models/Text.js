var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/happyminions');

var Text = mongoose.model('Text', new mongoose.Schema({
  text: String,
  start_time: Date,
  end_time: Date,
  sentiment: Number
}));

module.exports = Text;
