const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const slugify = require('slugify')
const Schema = mongoose.Schema;

// create a schema
const schema = new Schema({
  shipname: {
    type: String
  },
  title: {
      type: String
  },
  manager: {
    type: String
  },
  nationality: {
    type: String
  },
  gt: {
    type: String
  },
  power: {
    type: String
  },
  dateBoarding: {
    type: String
  },
  dateLeaved: {
    type: String
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
},
});

module.exports= mongoose.model('Experience', schema);