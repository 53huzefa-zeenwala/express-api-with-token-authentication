const ProductSchema = require("../Schema/Product.schema");
const Product = require("../models/Product.model");

const add = async (req, res, next) => {
  try {
    console.log(req.body);
    const result = await ProductSchema.validateAsync(req.body);

    const product = new Product(result);

    const savedProduct = await product.save();

    res.status(201).json(success("Product is added", savedProduct, 201));
  } catch (error) {
    if (error.isJoi == true) error.status = 422;
    next(error);
  }
};

const getAll = async (req, res, next) => {
  const query = req.query;
  try {
    let products;
    if (query.page === "all") {

      products = await Product.find();

    } else if (query.category || query.frametype) {

      products = await Product.find({
        $or: [{ category: query.category }, { frametype: query.frametype }],
      })
        .limit(4)
        .skip(query.page * 4);

    } else {
      products = await Product.find()
        .limit(4)
        .skip(query.page * 4);
    }
    res.status(200).json(success("Success", products, 200));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  add,
  getAll,
};
