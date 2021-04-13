const Joi = require("joi");

class UserLoginLogSchema {
    static schema = Joi.object({
        userId: Joi.string().min(3).trim(),
        logs: Joi.object(),
    })

    static requiredSchema = Joi.object({
        userId: Joi.string().min(3).trim().required(),
        logs: Joi.object().required(),
    })
}

module.exports = { UserLoginLogSchema }