const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
const slugify = require("slugify");
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
  url: {
    type: String,
  },
  btnText: {
    type: String,
  },
  image: {
    type: String,
  },
  type: {
    type: String,
  },
  position: {
    type: String,
  },
});

schema.plugin(mongoosePaginate);

module.exports = mongoose.model("Ads", schema);
