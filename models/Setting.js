const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const mongoosePaginate = require('mongoose-paginate');
const slugify = require('slugify')
const moment = require('moment')

const Schema = mongoose.Schema;

// create a schema
const schema = new Schema({
    title: {
      type: String
    },
    slogan: {
      type: String
    },
    company: {
      type: String
    },
    vision: {
      type: String
    },
    mission: {
      type: String
    },
    philosophy: {
      type: String
    },
    image: {
      type: String
    },
    thumb: {
      type: String
    },
    description: {
      type: String
    },
    keywords: {
      type: String
    },
    address: {
      type: String
    },
    hotline: {
      type: String
    },
    fax: {
      type: String
    },
    email: {
      type: String
    },
    facebook: {
      type: String
    },
    zalo: {
      type: String
    },
    twiter: {
      type: String
    },
    youtube: {
      type: String
    },
    copyright: {
      type: String
    },
    language: {
      type: String
    }
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    
  }
});

schema.plugin(mongoosePaginate);

module.exports = mongoose.model('Setting', schema);