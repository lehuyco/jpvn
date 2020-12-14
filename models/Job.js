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
    description: {
        type: String
    },
    more: {
        type: String
    },
    experience: {
        type: String
    },
    salary: {
        type: String
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'JobCategory'
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company'
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
    status: {
        type: String
    },
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    },
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

schema.plugin(mongoosePaginate);

module.exports = mongoose.model('Job', schema);