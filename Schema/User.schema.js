const Joi = require("joi");


const userSchema = Joi.object({
  _id: Joi.string().required(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().min(2).required(),
});

module.exports = userSchema;
