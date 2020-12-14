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
  company: {
    type: Schema.Types.ObjectId,
    ref: 'Company'
  },
  role: {
    type: String,
    default: 'admin'
  }
})

module.exports = mongoose.model('Recruiter', schema);