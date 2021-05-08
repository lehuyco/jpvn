const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");

// create a schema
const schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
  },
  image: {
    type: String,
  },
  thumb: {
    type: String,
  },
  language: {
    type: String,
  },
});

schema.plugin(mongoosePaginate);

module.exports = mongoose.model("Feature", schema);
