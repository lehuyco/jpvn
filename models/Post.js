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
    status: {
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
    keywords: {
        type: String
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    userId: {
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
    }],
    categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
});

schema.virtual('path').get(function () {
    return "/post/" + this.slug
})

schema.pre('save', function(next) {
    this.slug = slugify(this.title, { replacement: '-', remove: null, lower: true })
    next();
  });

schema.plugin(mongoosePaginate);

module.exports = mongoose.model('Post', schema);