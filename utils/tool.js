import isEqual from 'lodash/isEqual.js';
import isError from 'lodash/isError.js';
import { EFFECTIVE, FEE_TYPE } from '../constants/enum.js';

export const getProductsByEffective = (products, effective) => {
  const res = [];
  if (!products.length) return res;

  products.forEach(product => {
    const { effectiveFrom } = product;
    if (!effectiveFrom) return;
    const now = new Date().getTime();
    const time = new Date(effectiveFrom).getTime();
    const isFuture = now - time < 0;
    if (effective === EFFECTIVE.FUTURE && isFuture) {
      res.push(product);
    } else if (effective === EFFECTIVE.CURRENT && !isFuture) {
      res.push(product);
    }
  })
  return res;
}

export const toLowerCaseKeys = (object) => {
  return Object
    .entries(object)
    .reduce((carry, [key, value]) => {
      carry[key.toLowerCase()] = value;
      return carry
    }, {})
}

export const schemaValueCheck = (obj, standardObj) => {
  const error = [];
  const testObj = { ...obj };

  Object.keys(testObj).forEach(key => {
    let objValue = testObj[key];
    if ((typeof (objValue) === 'string')) {
      objValue = objValue.trim();
    }
    let standardObjValue = standardObj[key];
    if ((typeof (standardObjValue) === 'string')) {
      standardObjValue = standardObjValue.trim();
    }
    if (isEqual(objValue, standardObjValue)) return;
    error.push({
      obj: testObj.name,
      field: key,
      value: objValue,
      standardValue: standardObjValue,
    })
  });

  return error;
}

export const bankingProductFeeSchemaPolyfill = (obj) => {
  if (!isError(obj.error)) return true;
  const { label, value } = obj.error.details[0].context;
  if ((label === 'value') && (value.feeType === FEE_TYPE.VARIABLE)) return true;
  return obj;
}
