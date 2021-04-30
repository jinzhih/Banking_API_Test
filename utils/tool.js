import { EFFECTIVE } from '../constants/enum.js';

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
