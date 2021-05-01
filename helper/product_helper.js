import request from '../config/common.js';
import qa from '../config/qa.js';

export const getProducts = async (string) => {
  const url = string ? `/products?${string}` : '/products';
  const res = await request
    .get(url)
    .set('x-v', qa.currentVersion);
  return res;
}
