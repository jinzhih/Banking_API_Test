import Joi from 'joi';
import { FEATURE_TYPE } from '../../constants/enum.js';
import { PositiveIntegerRegex, NaturalNumberRegex } from '../../utils/regex.js';

export const BankingProductFeature = Joi.object({
  featureType: Joi.string().required()().valid(
    FEATURE_TYPE.ADDITIONAL_CARDS,
    FEATURE_TYPE.BALANCE_TRANSFERS,
    FEATURE_TYPE.BILL_PAYMENT,
    FEATURE_TYPE.BONUS_REWARDS,
    FEATURE_TYPE.CARD_ACCESS,
    FEATURE_TYPE.COMPLEMENTARY_PRODUCT_DISCOUNTS,
    FEATURE_TYPE.DIGITAL_BANKING,
    FEATURE_TYPE.DIGITAL_WALLET,
    FEATURE_TYPE.DONATE_INTEREST,
    FEATURE_TYPE.FREE_TXNS,
    FEATURE_TYPE.FREE_TXNS_ALLOWANCE,
    FEATURE_TYPE.INSURANCE,
    FEATURE_TYPE.INTEREST_FREE,
    FEATURE_TYPE.INTEREST_FREE_TRANSFERS,
    FEATURE_TYPE.LOYALTY_PROGRAM,
    FEATURE_TYPE.NOTIFICATIONS,
    FEATURE_TYPE.NPP_ENABLED,
    FEATURE_TYPE.NPP_PAYID,
    FEATURE_TYPE.OFFSET,
    FEATURE_TYPE.OTHER,
    FEATURE_TYPE.OVERDRAFT,
    FEATURE_TYPE.REDRAW,
    FEATURE_TYPE.UNLIMITED_TXNS,
  ),
  additionalValue: Joi
    .when('featureType',
      {
        switch: [
          {
            is: FEATURE_TYPE.ADDITIONAL_CARDS,
            then: Joi.string().required().pattern(PositiveIntegerRegex).allow(null)
              .message('additionalInfoUri can only be PositiveInteger or null when featureType is ADDITIONAL_CARDS'),
          },
          {
            is: FEATURE_TYPE.BILL_PAYMENT,
            then: Joi.string().allow(null, ''),
          },
          {
            is: FEATURE_TYPE.BONUS_REWARDS,
            then: Joi.string().required().pattern(NaturalNumberRegex),
          },
          {
            is: FEATURE_TYPE.CARD_ACCESS,
            then: Joi.string().required(),
          },
          {
            is: FEATURE_TYPE.COMPLEMENTARY_PRODUCT_DISCOUNTS,
            then: Joi.string().required(),
          },
          {
            is: FEATURE_TYPE.DIGITAL_WALLET,
            then: Joi.string().required(),
          },
          {
            is: FEATURE_TYPE.FREE_TXNS,
            then: Joi.string().required().pattern(NaturalNumberRegex),
          },
          {
            is: FEATURE_TYPE.FREE_TXNS_ALLOWANCE,
            then: Joi.string().required(), // TODO AmountStringRegex
          },
          {
            is: FEATURE_TYPE.INSURANCE,
            then: Joi.string().required(),
          },
          {
            is: FEATURE_TYPE.INTEREST_FREE,
            then: Joi.string().isoDuration().required(),
          },
          {
            is: FEATURE_TYPE.INTEREST_FREE_TRANSFERS,
            then: Joi.string().isoDuration().required(),
          },
          {
            is: FEATURE_TYPE.LOYALTY_PROGRAM,
            then: Joi.string().required(),
          },
          {
            is: FEATURE_TYPE.NOTIFICATIONS,
            then: Joi.string().required(),
            otherwise: Joi.forbidden(),
          },
        ],
      }),
  additionalInfo: Joi
    .when('featureType',
      {
        is: FEATURE_TYPE.OTHER,
        then: Joi.string().required(),
        otherwise: Joi.string().allow(null, ''),
      }),
  additionalInfoUri: Joi.string().uri().allow(null, ''),
});
