import chai, { expect } from 'chai';
import { getStandardProductsDetail } from '../helper/csv_helper.js';

describe.only('Get Product Detail', () => {
  let productData;
  let standardProductsDetail;

  before(async () => {
    standardProductsDetail = await getStandardProductsDetail();
  })

  describe('test', () => {
    it('ok', () => {
      console.log(standardProductsDetail)
    })
  })
})
