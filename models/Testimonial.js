const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

// create a schema
const schema = new Schema({
  name: {
    type: String,
    required: true
  },
  content: {
    type: String
  },
  image: {
    type: String
  },
  thumb: {
    type: String
  },
  company: {
    type: String
  },
  language: {
    type: String
  }
})

schema.plugin(mongoosePaginate);

module.exports = mongoose.model('Testimonial', schema);