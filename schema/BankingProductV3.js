import yup from 'yup';
import { PRODUCT_CATEGORY_ARRAY } from '../constants/enum.js';
import { ASCIIStringRegex, DateTimeStringRegex } from '../utils/regex.js';

export const schema = yup.object().shape({
  productID: yup.string().required().matches(ASCIIStringRegex),
  effectiveFrom: yup.string().notRequired().nullable().matches(DateTimeStringRegex),
  effectiveTo: yup.string().notRequired().nullable().matches(DateTimeStringRegex),
  lastUpdated: yup.string().required().matches(DateTimeStringRegex),
  productCategory: yup.string().oneOf(PRODUCT_CATEGORY_ARRAY),
  name: yup.string().required(),
  description: yup.string().required(),
  brand: yup.string().required(),
  brandName: yup.string().notRequired(),
  applicationUri: yup.url().notRequired(),
  isTailored: yup.boolean().required(),
  additionalInformation: yup.object().nullable().default(null).shape({
    overviewUri: yup.url().notRequired(),
    termsUri: yup.url().notRequired(),
    eligibilityUri: yup.url().notRequired(),
    feesAndPricingUri: yup.url().notRequired(),
    bundleUri: yup.url().notRequired(),
  }),
  cardArt: yup.object().nullable().default(null).shape({
    title: yup.string().notRequired(),
    imageUri: yup.url().required(),
  }),
});
