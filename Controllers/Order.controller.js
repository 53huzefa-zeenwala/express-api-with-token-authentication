const OrderSchema = require("../Schema/Order.schema");
const Order = require("../models/Order.model");

const add = async (req, res, next) => {
  try {
    const result = await OrderSchema.validateAsync(req.body);

    const order = new Order(result);

    const savedOrder = await order.save();

    res.json(savedOrder);
  } catch (error) {
    if (error.isJoi == true) error.status = 422;

    next(error);
  }
};

const getAll = async (req, res, next) => {
    try {
        const orders = await Order.find();
        res.json(orders)
    } catch (error) {
     next(error)   
    }
}

module.exports = {
    add,
    getAll
}
