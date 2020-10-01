const Joi = require("joi");
const authSchemaValidation = Joi.object({
  name: Joi.string().min(6).max(60).required(),
  email: Joi.string().email().min(6).max(100).required(),
  password: Joi.string().min(8).max(100).required(),
});
module.exports = authSchemaValidation;
