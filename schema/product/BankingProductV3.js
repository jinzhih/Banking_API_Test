import Joi from 'joi';
import { PRODUCT_CATEGORY } from '../../constants/enum.js';
import { ASCIIStringRegex, DateTimeStringRegex } from '../../utils/regex.js';

export const BankingProductV3Schema = Joi.object({
  productId: Joi.string().required().pattern(ASCIIStringRegex),
  effectiveFrom: Joi.string().allow(null, '').pattern(DateTimeStringRegex),
  effectiveTo: Joi.string().allow(null, '').pattern(DateTimeStringRegex),
  lastUpdated: Joi.string().required().pattern(DateTimeStringRegex),
  productCategory: Joi.string().required().valid(
    PRODUCT_CATEGORY.BUSINESS_LOANS,
    PRODUCT_CATEGORY.CRED_AND_CHRG_CARDS,
    PRODUCT_CATEGORY.LEASES,
    PRODUCT_CATEGORY.MARGIN_LOANS,
    PRODUCT_CATEGORY.OVERDRAFTS,
    PRODUCT_CATEGORY.PERS_LOANS,
    PRODUCT_CATEGORY.REGULATED_TRUST_ACCOUNTS,
    PRODUCT_CATEGORY.RESIDENTIAL_MORTGAGES,
    PRODUCT_CATEGORY.TERM_DEPOSITS,
    PRODUCT_CATEGORY.TRADE_FINANCE,
    PRODUCT_CATEGORY.TRANS_AND_SAVINGS_ACCOUNTS,
    PRODUCT_CATEGORY.TRAVEL_CARDS,
  ),
  name: Joi.string().required(),
  description: Joi.string().required(),
  brand: Joi.string().required(),
  brandName: Joi.string().allow(null, ''),
  applicationUri: Joi.string().uri().allow(null, ''),
  isTailored: Joi.boolean().required(),
  additionalInformation: Joi.object().allow(null).keys({
    overviewUri: Joi.string().uri().allow(null, ''),
    termsUri: Joi.string().uri().allow(null, ''),
    eligibilityUri: Joi.string().uri().allow(null, ''),
    feesAndPricingUri: Joi.string().uri().allow(null, ''),
    bundleUri: Joi.string().uri().allow(null, ''),
  }),
  cardArt: Joi.array().items({
    title: Joi.string().allow(null, ''),
    imageUri: Joi.string().uri().required(),
  }),
});
