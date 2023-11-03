const Joi = require('joi');

const orderSchema = Joi.object({
    segment: Joi.string().required(),
    country: Joi.string().required(),
    product: Joi.string(),
    discountBand: Joi.string(),
    unitSold: Joi.number(),
    manufacturingPrice: Joi.string(),
    salesPrice: Joi.string(),
    grossSales: Joi.string(),
    sales: Joi.string(),
    cogs: Joi.string(),
    monthNumber: Joi.number().max(2),
    monthName: Joi.string(),
    year: Joi.number(),
    date: Joi.string(),
});

module.exports = orderSchema;
