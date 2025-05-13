const Joi = require('joi')

const querySchema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required()
});

exports.querySchema = querySchema;