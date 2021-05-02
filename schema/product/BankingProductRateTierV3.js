import Joi from 'joi';
import { UNIT_OF_MEASURE } from '../../constants/enum.js';

export const BankingProductRateTierV3 = Joi.object({
  name: Joi.string().required(),
  unitOfMeasure: Joi.string().required().valid(
    UNIT_OF_MEASURE.DAY,
    UNIT_OF_MEASURE.DOLLAR,
    UNIT_OF_MEASURE.MONTH,
    UNIT_OF_MEASURE.PERCENT,
    UNIT_OF_MEASURE.PER_TIER,
    UNIT_OF_MEASURE.WHOLE_BALANCE,
  ),
  minimumValue: Joi.number().required(),
  maximumValue: Joi.number().required().allow(null),
  rateApplicationMethod: Joi.string().allow(null, ''),
  applicabilityConditions: Joi.object().allow(null).keys({
    additionalInfo: Joi.string().allow(null, ''),
    additionalInfoUri: Joi.string().uri().allow(null, ''),
  }),
  additionalInfo: Joi.string().allow(null, ''),
  additionalInfoUri: Joi.string().uri().allow(null, ''),
});
