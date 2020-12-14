const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Schema = mongoose.Schema;

// create a schema
const schema = new Schema({
  title: {
    type: String
  },
  image: {
    type: String
  },
  thumb: {
    type: String
  },
  file: {
    type: String
  },
});

var File = mongoose.model('File', schema);
module.exports = File;