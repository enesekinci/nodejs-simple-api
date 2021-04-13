const Joi = require("joi");

class UserSchema {
    static schema = Joi.object({
        name: Joi.string().min(3).max(50).trim(),
        username: Joi.string().min(3).max(50).trim(),
        email: Joi.string().trim().email(),
        password: Joi.string().trim().min(6),
    })

    static requiredSchema = Joi.object({
        name: Joi.string().min(3).max(50).trim().required(),
        username: Joi.string().min(3).max(50).trim().required(),
        email: Joi.string().trim().email().required(),
        password: Joi.string().trim().min(6).required(),
    })
}

module.exports = { UserSchema }