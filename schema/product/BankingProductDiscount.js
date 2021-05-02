import Joi from 'joi';
import { DISCOUNT_TYPE } from '../../constants/enum.js';
import { BankingProductDiscountEligibility } from './BankingProductDiscountEligibility.js';

export const BankingProductDiscount = Joi.object({
  description: Joi.string().required(),
  discountType: Joi.string().required().valid(
    DISCOUNT_TYPE.BALANCE,
    DISCOUNT_TYPE.DEPOSITS,
    DISCOUNT_TYPE.ELIGIBILITY_ONLY,
    DISCOUNT_TYPE.FEE_CAP,
    DISCOUNT_TYPE.PAYMENTS,
  ),
  amount: Joi.string().allow(null), // TODO AmountStringRegex
  balanceRate: Joi.string().allow(null), // TODO RateStringRegex
  transactionRate: Joi.string().allow(null), // TODO RateStringRegex
  accruedRate: Joi.string().allow(null), // TODO RateStringRegex
  feeRate: Joi.string().allow(null), // TODO RateStringRegex
  additionalValue: Joi
    .when('constraintType',
      {
        switch: [
          {
            is: DISCOUNT_TYPE.BALANCE,
            then: Joi.string().required(), // TODO AmountStringRegex
          },
          {
            is: DISCOUNT_TYPE.DEPOSITS,
            then: Joi.string().required(), // TODO AmountStringRegex
          },
          {
            is: DISCOUNT_TYPE.FEE_CAP,
            then: Joi.string().isoDuration().required(),
          },
          {
            is: DISCOUNT_TYPE.PAYMENTS,
            then: Joi.string().required(), // TODO AmountStringRegex
            otherwise: Joi.forbidden(),
          },
        ],
      }),
  additionalInfo: Joi.string().allow(null, ''),
  additionalInfoUri: Joi.string().uri().allow(null, ''),
  eligibility: Joi.when('discountType', {
    is: DISCOUNT_TYPE.ELIGIBILITY_ONLY,
    then: Joi.array().items(BankingProductDiscountEligibility).required(),
    otherwise: Joi.array().items(BankingProductDiscountEligibility).allow(null),
  }),
}).or('amount', 'balanceRate', 'transactionRate', 'accruedRate', 'feeRate');
