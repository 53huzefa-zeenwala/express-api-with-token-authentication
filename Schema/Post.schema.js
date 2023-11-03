const Joi = require('joi');

const postSchema = Joi.object({
    title: Joi.string().min(10).max(200).required(),
    description: Joi.string().min(20).required(),
    category: Joi.string().required(),
})

module.exports = postSchema;