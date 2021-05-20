import chai, { expect } from 'chai';
import { getStandardProductsFee } from '../helper/csv_helper.js';

describe('Get Product Detail', () => {
  let productData;
  let standardProductsDetail;

  before(async () => {
    standardProductsDetail = await getStandardProductsFee();
  })

  describe('Get StandardProductsFee', () => {
    it('ok', () => {
      expect(standardProductsDetail).to.be.true;
    })
  })
})
