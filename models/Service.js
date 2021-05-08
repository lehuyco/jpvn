const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
const mongoosePaginate = require("mongoose-paginate-v2");
const slugify = require("slugify");
const Schema = mongoose.Schema;

// create a schema
const schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
  },
  image: {
    type: String,
  },
  thumb: {
    type: String,
  },
  summary: {
    type: String,
  },
  content: {
    type: String,
  },
  language: {
    type: String,
  },
});

schema.plugin(mongoosePaginate);

schema.pre("save", function (next) {
  this.slug = slugify(this.title, {
    replacement: "-",
    remove: null,
    lower: true,
  });
  next();
});

schema.virtual("path").get(function () {
  return "/services/" + this.slug;
});

schema.statics.sample = async function (locale) {
  const count = await this.count();
  const rand = Math.floor(Math.random() * count);
  const docs = await this.find({ language: locale }).skip(rand).limit(5);
  return docs;
};

module.exports = mongoose.model("Service", schema);
