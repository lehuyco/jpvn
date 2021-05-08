const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
const mongoosePaginate = require("mongoose-paginate-v2");
const slugify = require("slugify");

const Schema = mongoose.Schema;

// create a schema
const schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      index: true,
    },
    enabled: {
      type: Boolean,
      default: true,
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
    type: {
      type: String,
    },
    keywords: {
      type: String,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    createdAt: {
      type: Date,
    },
    updatedAt: {
      type: Date,
    },
    tags: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
    toJSON: {
      transform: (doc, res) => {
        res.id = res._id;
        delete res._id;
        delete res.__v;
        return res;
      },
    },
  }
);

schema.pre("save", function (next) {
  this.slug = slugify(this.title, {
    replacement: "-",
    remove: null,
    lower: true,
  });
  next();
});

schema.plugin(mongoosePaginate);

module.exports = mongoose.model("Page", schema);
