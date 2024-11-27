const Joi = require("joi");

const signupSchema = Joi.object({
    email : Joi.string().email().required() ,
    password : Joi.string().min(8).required() ,
    name : Joi.string().required(),
    phoneNumber : Joi.string().required()
})

module.exports = { signupSchema};