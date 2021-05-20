import chai, { expect } from 'chai';
import { getProductsByEffective } from '../utils/tool.js';
import { EFFECTIVE } from '../constants/enum.js';

describe('getProductsByEffective', () => {
  it('return empty array', () => {
    const products = [];
    const res = getProductsByEffective(products, EFFECTIVE.CURRENT);
    expect(res.length).to.be.eq(0);
  })

  it('return empty array when effectiveFrom is null', () => {
    const products = [{
      effectiveFrom: null,
    }];
    const res = getProductsByEffective(products, EFFECTIVE.CURRENT);
    expect(res.length).to.be.eq(0);
  })

  it('return correct CURRENT products', () => {
    const products = [{
      effectiveFrom: '1995-12-17T03:24:00',
    }];
    const res = getProductsByEffective(products, EFFECTIVE.CURRENT);
    expect(res.length).to.be.eq(1);
  })

  it('return correct CURRENT products', () => {
    const products = [{
      effectiveFrom: '1995-12-17T03:24:00',
    }, {
      effectiveFrom: '1999-12-17T03:24:00',
    }, {
      effectiveFrom: '2022-12-17T03:24:00',
    }];
    const res = getProductsByEffective(products, EFFECTIVE.CURRENT);
    expect(res.length).to.be.eq(2);
  })

  it('return correct FUTURE products', () => {
    const products = [{
      effectiveFrom: '1995-12-17T03:24:00',
    }];
    const res = getProductsByEffective(products, EFFECTIVE.FUTURE);
    expect(res.length).to.be.eq(0);
  })

  it('return correct FUTURE products', () => {
    const products = [{
      effectiveFrom: '1995-12-17T03:24:00',
    }, {
      effectiveFrom: '1999-12-17T03:24:00',
    }, {
      effectiveFrom: '2022-12-17T03:24:00',
    }];
    const res = getProductsByEffective(products, EFFECTIVE.FUTURE);
    expect(res.length).to.be.eq(1);
  })
})
