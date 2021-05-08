const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
const mongoosePaginate = require("mongoose-paginate-v2");

const Schema = mongoose.Schema;

// create a schema
const schema = new Schema(
  {
    position: {
      type: Schema.Types.ObjectId,
      ref: "Job",
    },
    name: {
      type: String,
    },
    address: {
      type: String,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    comment: {
      type: String,
    },
    attach: {
      type: String,
    },
    file: {
      type: Object,
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

schema.plugin(mongoosePaginate);

module.exports = mongoose.model("Candidate", schema);
