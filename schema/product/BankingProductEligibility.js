import Joi from 'joi';
import { ELIGIBILITY_TYPE } from '../../constants/enum.js';
import { PositiveIntegerRegex } from '../../utils/regex.js';

export const BankingProductEligibility = Joi.object({
  eligibilityType: Joi.string().required()().valid(
    ELIGIBILITY_TYPE.BUSINESS,
    ELIGIBILITY_TYPE.EMPLOYMENT_STATUS,
    ELIGIBILITY_TYPE.MAX_AGE,
    ELIGIBILITY_TYPE.MIN_AGE,
    ELIGIBILITY_TYPE.MIN_INCOME,
    ELIGIBILITY_TYPE.MIN_TURNOVER,
    ELIGIBILITY_TYPE.NATURAL_PERSON,
    ELIGIBILITY_TYPE.OTHER,
    ELIGIBILITY_TYPE.PENSION_RECIPIENT,
    ELIGIBILITY_TYPE.RESIDENCY_STATUS,
    ELIGIBILITY_TYPE.STAFF, 
    ELIGIBILITY_TYPE.STUDENT,
  ),
  additionalValue: Joi
    .when('eligibilityType',
      {
        switch: [
          {
            is: ELIGIBILITY_TYPE.EMPLOYMENT_STATUS,
            then: Joi.string().required(),
          },
          {
            is: ELIGIBILITY_TYPE.MAX_AGE,
            then: Joi.string().required().pattern(PositiveIntegerRegex),
          },
          {
            is: ELIGIBILITY_TYPE.MIN_AGE,
            then: Joi.string().required().pattern(PositiveIntegerRegex),
          },
          {
            is: ELIGIBILITY_TYPE.MIN_INCOME,
            then: Joi.string().required(), // TODO AmountStringRegex
          },
          {
            is: ELIGIBILITY_TYPE.MIN_TURNOVER,
            then: Joi.string().required(), // TODO AmountStringRegex
          },
          {
            is: ELIGIBILITY_TYPE.RESIDENCY_STATUS,
            then: Joi.string().required(),
            otherwise: Joi.forbidden(),
          },
        ],
      }),
  additionalInfo: Joi
    .when('eligibilityType',
      {
        is: ELIGIBILITY_TYPE.OTHER,
        then: Joi.string().required(),
        otherwise: Joi.string().allow(null, ''),
      }),
  additionalInfoUri: Joi.string().uri().allow(null, ''),
});
