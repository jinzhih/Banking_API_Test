import Joi from 'joi';
import { LENDING_RATE_TYPE } from '../../constants/enum.js';
import { BankingProductRateTierV3 } from './BankingProductRateTierV3.js';

export const BankingProductLendingRateV2 = Joi.object({
  lendingRateType: Joi.string().required().valid(
    LENDING_RATE_TYPE.BUNDLE_DISCOUNT_FIXED,
    LENDING_RATE_TYPE.BUNDLE_DISCOUNT_VARIABLE,
    LENDING_RATE_TYPE.CASH_ADVANCE,
    LENDING_RATE_TYPE.DISCOUNT,
    LENDING_RATE_TYPE.FIXED,
    LENDING_RATE_TYPE.FLOATING,
    LENDING_RATE_TYPE.INTRODUCTORY,
    LENDING_RATE_TYPE.MARKET_LINKED,
    LENDING_RATE_TYPE.PENALTY,
    LENDING_RATE_TYPE.PURCHASE,
    LENDING_RATE_TYPE.VARIABLE,
    LENDING_RATE_TYPE.IN_ADVANCE,
    LENDING_RATE_TYPE.IN_ARREARS,
    LENDING_RATE_TYPE.INTEREST_ONLY,
    LENDING_RATE_TYPE.PRINCIPAL_AND_INTEREST,
    LENDING_RATE_TYPE.INVESTMENT,
    LENDING_RATE_TYPE.OWNER_OCCUPIED,
  ),
  rate: Joi.string().required(), // TODO RateStringRegex
  comparisonRate: Joi.string().allow(null, ''), // TODO RateStringRegex
  calculationFrequency: Joi.string().isoDuration().allow(null, ''),
  applicationFrequency: Joi.string().isoDuration().allow(null, ''),
  interestPaymentDue: Joi.string().allow(null, ''),
  repaymentType: Joi.string().allow(null, ''),
  loanPurpose: Joi.string().allow(null, ''),
  tiers: Joi.array().items(BankingProductRateTierV3).allow(null),
  additionalValue: Joi
    .when('lendingRateType',
      {
        switch: [
          {
            is: LENDING_RATE_TYPE.BUNDLE_DISCOUNT_FIXED,
            then: Joi.string().required(),
          },
          {
            is: LENDING_RATE_TYPE.BUNDLE_DISCOUNT_VARIABLE,
            then: Joi.string().required(),
          },
          {
            is: LENDING_RATE_TYPE.DISCOUNT,
            then: Joi.string().required(),
          },
          {
            is: LENDING_RATE_TYPE.FIXED,
            then: Joi.string().isoDuration().required(),
          },
          {
            is: DEPOSIT_RATE_TYPE.FLOATING,
            then: Joi.string().required(),
          },
          {
            is: LENDING_RATE_TYPE.INTRODUCTORY,
            then: Joi.string().isoDuration().required(),
          },
          {
            is: LENDING_RATE_TYPE.MARKET_LINKED,
            then: Joi.string().required(),
          },
          {
            is: DEPOSIT_RATE_TYPE.PENALTY,
            then: Joi.string().required(),
            otherwise: Joi.forbidden(),
          },
        ],
      }),
  additionalInfo: Joi.string().allow(null, ''),
  additionalInfoUri: Joi.string().uri().allow(null, ''),
});
