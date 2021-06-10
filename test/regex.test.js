import chai, { expect } from 'chai';
import { AmountStringRegex } from '../utils/regex.js';

describe('checkAmountStringRegex', () => {
  it('return false if no number before decimal', () => {
    const amountString = '.23';
    const res = AmountStringRegex.test(amountString);
    expect(res).to.be.eq(false);
  })

  it('returen false if additional formatting', () => {
    const amountString = '100,100.23';
    const res = AmountStringRegex.test(amountString);
    expect(res).to.be.eq(false);
  })

  it('returen true if negtive number', () => {
    const amountString = '-1001.23';
    const res = AmountStringRegex.test(amountString);
    expect(res).to.be.eq(true);
  })

  it('returen false if only 1 digit following a decimal point ', () => {
    const amountString = '1.9';
    const res = AmountStringRegex.test(amountString);
    expect(res).to.be.eq(false);
  })

  it('returen false if more than 16 digits before the decimal', () => {
    const amountString = '11111111111111111.11s';
    const res = AmountStringRegex.test(amountString);
    expect(res).to.be.eq(false);
  })
})