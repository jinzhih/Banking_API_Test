import Joi from 'joi';
import { CurrencyStringRegex } from '../../utils/regex.js';
import { FEE_TYPE } from '../../constants/enum.js';
import { BankingProductDiscount } from './BankingProductDiscount.js';

export const BankingProductFee = Joi.object({
  name: Joi.string().required(),
  feeType: Joi.string().required(),
  amount: Joi.string().allow(null), // TODO AmountStringRegex
  balanceRate: Joi.string().allow(null), // TODO RateStringRegex
  transactionRate: Joi.string().allow(null), // TODO RateStringRegex
  accruedRate: Joi.string().allow(null), // TODO RateStringRegex
  accrualFrequency: Joi.when('balanceRate', {
    is: Joi.exist(),
    then: Joi.string().isoDuration().allow(null, ''),
    otherwise: Joi.when('accruedRate',
      {
        is: Joi.exist(),
        then: Joi.string().isoDuration().allow(null, ''),
        otherwise: Joi.forbidden(),
      }),
  }),
  currency: Joi.string().pattern(CurrencyStringRegex),
  additionalValue: Joi.when('feeType', {
    is: FEE_TYPE.PERIODIC,
    then: Joi.string().isoDuration().required(),
    otherwise: Joi.forbidden(),
  }),
  additionalInfo: Joi.string().allow(null, ''),
  additionalInfoUri: Joi.string().uri().allow(null, ''),
  discounts: Joi.array().items(BankingProductDiscount).allow(null),
}).or('amount', 'balanceRate', 'transactionRate', 'accruedRate');
