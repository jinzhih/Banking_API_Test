import Joi from 'joi';
import { DEPOSIT_RATE_TYPE } from '../../constants/enum.js';
import { BankingProductRateTierV3 } from './BankingProductRateTierV3.js';

export const BankingProductDepositRate = Joi.object({
  depositRateType: Joi.string().required().valid(
    DEPOSIT_RATE_TYPE.BONUS,
    DEPOSIT_RATE_TYPE.BUNDLE_BONUS,
    DEPOSIT_RATE_TYPE.FIXED,
    DEPOSIT_RATE_TYPE.FLOATING,
    DEPOSIT_RATE_TYPE.INTRODUCTORY,
    DEPOSIT_RATE_TYPE.MARKET_LINKED,
    DEPOSIT_RATE_TYPE.VARIABLE,
  ),
  rate: Joi.string().required(), // TODO RateStringRegex
  calculationFrequency: Joi.string().isoDuration().allow(null, ''),
  applicationFrequency: Joi.string().isoDuration().allow(null, ''),
  tiers: Joi.array().items(BankingProductRateTierV3).allow(null),
  additionalValue: Joi
    .when('constraintType',
      {
        switch: [
          {
            is: DEPOSIT_RATE_TYPE.BONUS,
            then: Joi.string().required(),
          },
          {
            is: DEPOSIT_RATE_TYPE.BUNDLE_BONUS,
            then: Joi.string().required(),
          },
          {
            is: DEPOSIT_RATE_TYPE.FIXED,
            then: Joi.string().isoDuration().required(),
          },
          {
            is: DEPOSIT_RATE_TYPE.FLOATING,
            then: Joi.string().required(),
          },
          {
            is: DEPOSIT_RATE_TYPE.INTRODUCTORY,
            then: Joi.string().isoDuration().required(),
          },
          {
            is: DEPOSIT_RATE_TYPE.MARKET_LINKED,
            then: Joi.string().required(),
            otherwise: Joi.forbidden(),
          },
        ],
      }),
  additionalInfo: Joi.string().allow(null, ''),
  additionalInfoUri: Joi.string().uri().allow(null, ''),
});
