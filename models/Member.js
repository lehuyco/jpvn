const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const Schema = mongoose.Schema

// create a schema
const schema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    image: {
        type: String,
    },
    thumb: {
        type: String,
    },
    content: {
        type: String,
    },
    position: {
        type: String,
    },
    language: {
        type: String,
    },
})

schema.plugin(mongoosePaginate)

module.exports = mongoose.model('Member', schema)
