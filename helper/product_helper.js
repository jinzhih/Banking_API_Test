import request from '../config/common.js';

export const getProducts = async (string) => {
  const url = string ? `/products?${string}` : '/products';
  const res = await request
    .get(url)
    .set('x-v', 3);
  return res;
}
