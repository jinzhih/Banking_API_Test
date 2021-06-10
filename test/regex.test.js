import chai, { expect } from 'chai';
import { AmountStringRegex } from '../utils/regex.js';

describe('checkAmountStringRegex', () => {
  it.only('return false if no number before decimal', () => {
    const amountString = '.23';
    const res = AmountStringRegex.test(amountString);
    expect(res).to.be.eq(false);
  })

  it.only('returen true if negtive number', () => {
    const amountString = '-1001.23';
    const res = AmountStringRegex.test(amountString);
    expect(res).to.be.eq(true);
  })
})