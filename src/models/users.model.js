const Joi = require('joi')

const querySchema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).email().required(),
    password: Joi.string().min(5).max(512).required(),
    companyId: Joi.number(),
    isActive: Joi.boolean()
});

exports.querySchema = querySchema;