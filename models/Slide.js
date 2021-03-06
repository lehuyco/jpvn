const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const slugify = require('slugify')
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

// create a schema
const schema = new Schema({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String
  },
  content: {
    type: String
  },
  url: {
    type: String
  },
  btnText: {
    type: String
  },
  image: {
    type: String
  },
  language: {
    type: String
  }
});

schema.plugin(mongoosePaginate);

module.exports = mongoose.model('Slide', schema);