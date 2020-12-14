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
  keywords: {
    type: String
  },
  language: {
    type: String
  },
  slug: {
    type: String,
    index: true
  }
}, {
    toJSON: {
        transform: (doc, res) => {
            res.id = res._id
            delete res._id
            delete res.__v
            return res
        }
    }
});

schema.pre('save', function(next) {
  this.slug = slugify(this.title, { replacement: '-', remove: null, lower: true })
  next();
});

var Category = mongoose.model('Category', schema);
module.exports = Category;