const OrderSchema = require("../Schema/Order.schema");
const Order = require("../models/Order.model");

const add = async (req, res, next) => {
  try {
    const result = await OrderSchema.validateAsync(req.body);

    const order = new Order(result);

    const savedOrder = await order.save();

    res.status(201).json(success("Order has been created", savedOrder, 201));
  } catch (error) {
    if (error.isJoi == true) error.status = 422;

    next(error);
  }
};

const getAll = async (req, res, next) => {
    try {
        const orders = await Order.find();
        res.status(200).json(success("Success", orders, 200));
    } catch (error) {
     next(error)   
    }
}

module.exports = {
    add,
    getAll
}
