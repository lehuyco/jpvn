const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
const mongoosePaginate = require("mongoose-paginate-v2");
const slugify = require("slugify");

const Schema = mongoose.Schema;

// create a schema
const schema = new Schema(
  {
    company_name: {
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
    service_request: [
      {
        type: String,
      },
    ],
    country_of_origin: {
      type: String,
    },
    pickup_address: {
      type: String,
    },
    country_of_destination: {
      type: String,
    },
    delivery_address: {
      type: String,
    },
    cargo_type: {
      type: String,
    },
    cargo_quantity: {
      type: String,
    },
    shipping_term: {
      type: String,
    },
    details_of_weight: {
      type: String,
    },
    attach_file: {
      type: String,
    },
    specific_comment: {
      type: String,
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

module.exports = mongoose.model("Quote", schema);
