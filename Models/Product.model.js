const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      maxlength: 60,
    },
    description: {
      type: String,
      required: true,
      maxlength: 200,
    },
    price: {
      type: Number,
      required: true,
    },
    mrp: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    frametype: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    productdetail: {
      type: [
        {
          name: { type: String, required: true },
          detail: { type: String, required: true },
        },
      ],
    },
    images: {
      type: [String],
      required: true,
    },
    instock: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);
const Product = mongoose.model('products', ProductSchema);

module.exports = Product;
