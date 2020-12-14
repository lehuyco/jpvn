const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

// create a schema
const schema = new Schema({
  title: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  thumb: {
    type: String
  },
  content: {
    type: String
  },
  position: {
    type: String
  },
  language: {
    type: String
  },
})

schema.plugin(mongoosePaginate);

module.exports = mongoose.model('Widget', schema);