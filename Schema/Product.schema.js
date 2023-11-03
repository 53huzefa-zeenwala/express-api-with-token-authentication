const Joi = require("joi");

const productSchema = Joi.object({
  title: Joi.string().min(10).max(60).required(),
  description: Joi.string().min(20).max(200).required(),
  price: Joi.number().required(),
  mrp: Joi.number().required(),
  discount: Joi.number().required(),
  category: Joi.string().required(),
  brand: Joi.string().required(),
  frametype: Joi.string().required(),
  color: Joi.string().required(),
  productdetail: Joi.array()
    .items(
      Joi.object().keys({
        name: Joi.string().min(2).required(),
        detail: Joi.string().min(2).required(),
      })
    ),
  images: Joi.array().items(Joi.string().uri()),
  instock: Joi.number().required(),
});

module.exports = productSchema;
