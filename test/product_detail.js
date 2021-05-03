import chai, { expect } from 'chai';
import { getStandardProductsConstraint } from '../helper/csv_helper.js';

describe.only('Get Product Detail', () => {
  let productData;
  let standardProductsDetail;

  before(async () => {
    standardProductsDetail = await getStandardProductsConstraint();
  })

  describe('test', () => {
    it('ok', () => {
      console.log(standardProductsDetail)
    })
  })
})
