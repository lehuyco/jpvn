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
  slug: {
    type: String,
    index: true
  },
  image: {
    type: String
  },
  thumb: {
    type: String
  },
  overview: {
    type: String
  },
  type: {
    type: String
  },
  email: {
    type: String
  },
  website: {
    type: String
  },
  address: {
    type: String
  },
  size: {
    type: String
  },
  phone: {
    type: String
  },
  editorChoice: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    default: 'pending'
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

var Category = mongoose.model('Company', schema);
module.exports = Category;