import chai, { expect } from 'chai';
import isError from 'lodash/isError.js';
import { BankingProductFee } from '../schema/product/BankingProductFee.js';
import { bankingProductFeeSchemaPolyfill } from '../utils/tool.js'
import { FEE_TYPE } from '../constants/enum.js';

describe('Schema Test', () => {
  context.only('BankingProductFee Schema Test', () => {
    it('return error when name field is missing', () => {
      const obj = {
        feeType: 'type',
      }
      const res = BankingProductFee.validate(obj);
      expect(isError(res.error)).to.be.true;
    })

    it('return error when feeType field is missing', () => {
      const obj = {
        name: 'jim',
      }
      const res = BankingProductFee.validate(obj);
      expect(isError(res.error)).to.be.true;
    })

    it('return error when amount, balanceRate, transactionRate, accruedRate are missing and feeType is not VARIABLE', () => {
      const obj = {
        name: 'jim',
        feeType: 'type',
      }
      const joiRes = BankingProductFee.validate(obj);
      const res = bankingProductFeeSchemaPolyfill(joiRes);
      expect(isError(res.error)).to.be.true;
    })

    it('return true when amount, balanceRate, transactionRate, accruedRate are missing and feeType is VARIABLE', () => {
      const obj = {
        name: 'jim',
        feeType: FEE_TYPE.VARIABLE,
      }
      const joiRes = BankingProductFee.validate(obj);
      const res = bankingProductFeeSchemaPolyfill(joiRes);
      expect(isError(res.error)).to.be.false;
    })

    it('return true when at least one of amount, balanceRate, transactionRate, accruedRate exist and feeType is not VARIABLE', () => {
      const obj = {
        name: 'jim',
        feeType: 'type',
        amount: '100',
      }
      const joiRes = BankingProductFee.validate(obj);
      const res = bankingProductFeeSchemaPolyfill(joiRes);
      expect(isError(res.error)).to.be.false;
    })

    it('return error when accrualFrequency exist, balanceRate and accruedRate is missing', () => {
      const obj = {
        name: 'jim',
        feeType: 'type',
        amount: '100',
        accrualFrequency: 'P3Y6M4DT12H30M5S',
      }
      const res = BankingProductFee.validate(obj);
      expect(isError(res.error)).to.be.true;
    })

    it('return error when accrualFrequency value is invalid', () => {
      const obj = {
        name: 'jim',
        feeType: 'type',
        amount: '100',
        balanceRate: '21.00',
        accrualFrequency: 'wefd',
      }
      const res = BankingProductFee.validate(obj);
      expect(isError(res.error)).to.be.true;
    })
  })
})
