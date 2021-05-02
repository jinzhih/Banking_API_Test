import Joi from 'joi';
import { DISCOUNT_ELIGIBILITY_TYPE } from '../../constants/enum.js';
import { NaturalNumberRegex } from '../../utils/regex.js';

export const BankingProductDiscountEligibility = Joi.object({
  discountEligibilityType: Joi.string().required().valid(
    DISCOUNT_ELIGIBILITY_TYPE.BUSINESS,
    DISCOUNT_ELIGIBILITY_TYPE.EMPLOYMENT_STATUS,
    DISCOUNT_ELIGIBILITY_TYPE.INTRODUCTORY,
    DISCOUNT_ELIGIBILITY_TYPE.MAX_AGE,
    DISCOUNT_ELIGIBILITY_TYPE.MIN_AGE,
    DISCOUNT_ELIGIBILITY_TYPE.MIN_INCOME,
    DISCOUNT_ELIGIBILITY_TYPE.MIN_TURNOVER,
    DISCOUNT_ELIGIBILITY_TYPE.NATURAL_PERSON,
    DISCOUNT_ELIGIBILITY_TYPE.OTHER,
    DISCOUNT_ELIGIBILITY_TYPE.PENSION_RECIPIENT,
    DISCOUNT_ELIGIBILITY_TYPE.RESIDENCY_STATUS,
    DISCOUNT_ELIGIBILITY_TYPE.STAFF,
    DISCOUNT_ELIGIBILITY_TYPE.STUDENT,
  ),
  additionalValue: Joi
    .when('discountEligibilityType',
      {
        switch: [
          {
            is: DISCOUNT_ELIGIBILITY_TYPE.EMPLOYMENT_STATUS,
            then: Joi.string().required(),
          },
          {
            is: DISCOUNT_ELIGIBILITY_TYPE.INTRODUCTORY,
            then: Joi.string().isoDuration().required(),
          },
          {
            is: DISCOUNT_ELIGIBILITY_TYPE.MAX_AGE,
            then: Joi.string().required().pattern(NaturalNumberRegex),
          },
          {
            is: DISCOUNT_ELIGIBILITY_TYPE.MIN_AGE,
            then: Joi.string().required().pattern(NaturalNumberRegex),
          },
          {
            is: DISCOUNT_ELIGIBILITY_TYPE.MIN_INCOME,
            then: Joi.string().required(), // TODO AmountStringRegex
          },
          {
            is: DISCOUNT_ELIGIBILITY_TYPE.MIN_TURNOVER,
            then: Joi.string().required(), // TODO AmountStringRegex
          },
          {
            is: DISCOUNT_ELIGIBILITY_TYPE.PENSION_RECIPIENT,
            then: Joi.string().allow(null, ''),
          },
          {
            is: DISCOUNT_ELIGIBILITY_TYPE.RESIDENCY_STATUS,
            then: Joi.string().required(),
          },
          {
            is: DISCOUNT_ELIGIBILITY_TYPE.STUDENT,
            then: Joi.string().allow(null, ''),
            otherwise: Joi.forbidden(),
          },
        ],
      }),
  additionalInfo: Joi
    .when('discountEligibilityType',
      {
        is: DISCOUNT_ELIGIBILITY_TYPE.OTHER,
        then: Joi.string().required(),
        otherwise: Joi.string().allow(null, ''),
      }),
  additionalInfoUri: Joi.string().uri().allow(null, ''),
});
