const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const slugify = require('slugify')
const Schema = mongoose.Schema;

// create a schema
const schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  job: {
    type: Schema.Types.ObjectId,
    ref: 'Job'
  },
  company: {
    type: Schema.Types.ObjectId,
    ref: 'Company'
  },
  letter: {
    type: String
  },
  status: {
    type: String
  },
});

module.exports = mongoose.model('Application', schema);