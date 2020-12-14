const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Schema = mongoose.Schema;

// create a schema
const schema = new Schema({
  title: {
      type: String,
      required: true
  },
  content: {
    type: String,
    index: true
  },
});

module.exports = mongoose.model('Notification', schema);