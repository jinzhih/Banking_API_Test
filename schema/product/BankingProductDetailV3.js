import Joi from 'joi';
import { BankingProductV3Schema } from './BankingProductV3.js';
import { BankingProductBundle } from './BankingProductBundle.js';
import { BankingProductFeature } from './BankingProductFeature.js';
import { BankingProductConstraint } from './BankingProductConstraint.js';
import { BankingProductEligibility } from './BankingProductEligibility.js';
import { BankingProductFee } from './BankingProductFee.js';
import { BankingProductDepositRate } from './BankingProductDepositRate.js';
import { BankingProductLendingRateV2 } from './BankingProductLendingRateV2.js';

export const BankingProductDetailV3 = BankingProductV3Schema.append({
  bundles: Joi.array().items(BankingProductBundle).allow(null),
  features: Joi.array().items(BankingProductFeature).allow(null),
  constraints: Joi.array().items(BankingProductConstraint).allow(null),
  eligibility: Joi.array().items(BankingProductEligibility).allow(null),
  fees: Joi.array().items(BankingProductFee).allow(null),
  depositRates: Joi.array().items(BankingProductDepositRate).allow(null),
  lendingRates: Joi.array().items(BankingProductLendingRateV2).allow(null),
})
