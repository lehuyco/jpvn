const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const mongoosePaginate = require('mongoose-paginate');
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
    enabled: {
        type: Boolean,
        default: true
    },
    image: {
        type: String
    },
    thumb: {
        type: String
    },
    summary: {
        type: String
    },
    content: {
        type: String,
        required: true
    },
    language: {
        type: String
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date
    },
    updatedAt: {
        type: Date
    },
    tags: [{
        type: String
    }]
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
});

schema.virtual('path').get(function () {
    return "/projects/" + this.slug
})

schema.pre('save', function(next) {
    this.slug = slugify(this.title, { replacement: '-', remove: null, lower: true })
    next();
});

schema.statics.sample = async function(locale) {
  const count = await this.count();
  const rand = Math.floor(Math.random() * count);
  const docs = await this.find({language: locale}).skip(rand).limit(5);
  return docs;
};

schema.plugin(mongoosePaginate);

module.exports = mongoose.model('Project', schema);