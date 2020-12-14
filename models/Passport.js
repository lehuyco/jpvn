const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const slugify = require('slugify')
const Schema = mongoose.Schema;

// create a schema
const schema = new Schema({
  type: {
    type: String,
    required: true
  },
  placeIssued: {
    type: String,
    required: true
  },
  number: {
    type: String,
    required: true
  },
  dateIssued: {
    type: String,
    required: true
  },
  dateExpired: {
    type: String
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
},
});

module.exports= mongoose.model('Passport', schema);