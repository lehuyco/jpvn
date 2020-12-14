const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const slugify = require('slugify')
const Schema = mongoose.Schema;

// create a schema
const schema = new Schema({
  title: {
      type: String,
      required: true
  },
  graduatedAt: {
    type: String
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
},
});

module.exports= mongoose.model('Education', schema);