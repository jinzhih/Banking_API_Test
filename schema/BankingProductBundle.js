import Joi from 'joi';

export const BankingProductBundle = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  additionalInfo: Joi.string().allow(null, ''),
  additionalInfoUri: Joi.string().uri().allow(null, ''),
  productIds: Joi.array().items(Joi.string().allow(null, '')).allow(null),
});

