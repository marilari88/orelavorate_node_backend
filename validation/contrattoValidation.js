const Joi = require("joi");
const contrattoSchemaValidation = Joi.object({
  nomeContratto: Joi.string().min(2).max(40).required(),
  nomeAzienda: Joi.string().min(2).max(40).required(),
  inizioContratto: Joi.date().required(),
  fineContratto: Joi.date(),
  userId: Joi.string().required(),
});
module.exports = contrattoSchemaValidation;
