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
  icon: {
    type: String
  },
  slug: {
    type: String,
    index: true
  },
  jobCount: {
    type: Number
  },
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

var Category = mongoose.model('JobCategory', schema);
module.exports = Category;