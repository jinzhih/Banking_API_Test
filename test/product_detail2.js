import chai, { expect } from 'chai';
import { getProducts } from '../helper/product_helper.js';
import request from '../config/common.js';
import qa from '../config/qa.js';
import { ASCIIStringRegex, DateTimeStringRegex, RateStringRegex } from '../utils/regex.js';
import faker from 'faker';
import { PAGINATION, HEADERS_STANDARD } from '../constants/rules.js';
import { PRODUCT_CATEGORY, PRODUCT_CATEGORY_ARRAY, FEATURE_TYPE, CONSTRAINT_TYPE, ELIGIBILITY_TYPE, FEE_TYPE, DEPOSIT_RATE_TYPE, UNIT_OF_MEASURE, LENDING_RATE_TYPE } from '../constants/enum.js';

let productsData;
let productIds=[];
let productDetailData;

before(async () => {
  productsData = await getProducts();
})

it('List products id', async () => {
  const { products } = productsData.body.data;
  //console.log(products);
  let { totalPages } = productsData.body.meta;      
  for (let i = 0; i < totalPages; i++) {
    productsData = await getProducts(`page-size=${i}`)
    if (products.length>0) {
      products.forEach(product => {        
        productIds.push(product.productId);
      })
    }            
  }  
  
  //productIds.push('51dd511c-abf8-4aaa-941c-631a26848111');
  //productIds.push('7671eaa8-549b-48eb-a73e-ed6547ff40ed');
  let i=0
  productIds.forEach(productId => {
    i++;
    describe(i+'. Product detail: Negative testing for '+productId, () => {
      it('Return error when missing x-v field in request header', async () => {
        const res = await request.get('/products/'+productId)
        expect(res.statusCode).to.be.eq(406);
        expect(res.body).to.have.property('errors');
        //console.log(res.body.errors)
      })
  
      it('Return error when enter invalid x-v field in request header', async () => {
        const randomValue = faker.lorem.word();
        const res = await request
          .get('/products/'+productId)
          .set('x-v', randomValue)
        expect(res.statusCode).to.be.eq(406);
        expect(res.body).to.have.property('errors');
      })
  
      it('Return error when x-v value is greater than current highest version', async () => {
        const randomNumber = faker.datatype.number({ min: Number(qa.currentVersion) + 1 });
        const res = await request
          .get('/products/'+productId)
          .set('x-v', randomNumber)
        expect(res.statusCode).to.be.eq(406);
        expect(res.body).to.have.property('errors');
      })
  
      it('Return error when set an unacceptable Accept value in request header', async () => {
        const randomValue = faker.lorem.word();
        if (randomValue !== HEADERS_STANDARD.CONTENT_TYPE) {
          const res = await request
            .get('/products/'+productId)
            .set('x-v', qa.currentVersion)
            .set('Accept', randomValue)
          expect(res.statusCode).to.be.eq(406);
          expect(res.body).to.have.property('errors');
        }
      })
    })

    describe(i+'. Product detail: Mandatory parameters for '+productId, () => { 

      before(async () => {   
        //productDetailData = await getProducts('51dd511c-abf8-4aaa-941c-631a26848111'); //depositRates
        //productDetailData = await getProducts('7671eaa8-549b-48eb-a73e-ed6547ff40ed'); //lendingRates
        productDetailData = await getProducts(productId);
      })

      it('check productId', () => {   
        let { productId } = productDetailData.body.data;        
        const res = ASCIIStringRegex.test(productId);
        expect(res).to.be.eq(true);      
      })
  
      it('check lastUpdated', () => {   
        let { lastUpdated } = productDetailData.body.data;        
        const res = DateTimeStringRegex.test(lastUpdated);
        expect(res).to.be.eq(true);      
      })
  
      it('check PRODUCT_CATEGORY', () => {
        let { productCategory } = productDetailData.body.data;  
        expect(PRODUCT_CATEGORY[productCategory]).to.be.eq(productCategory);  
      })
  
      it('check name', () => {
        let { name } = productDetailData.body.data;
        expect(name.length).to.not.eq(0);  
      })
  
      it('check description', () => {
        let { description } = productDetailData.body.data;
        expect(description.length).to.not.eq(0);  
      })
  
      it('check brand', () => {
        let { brand } = productDetailData.body.data;
        expect(brand.length).to.not.eq(0);  
      })
  
      it('check isTailored', () => {
        let { isTailored } = productDetailData.body.data;    
        expect(typeof(isTailored)).to.be.eq('boolean');  
      })
  
      it('check cardArt', () => { //!!!!!!!! Check URI reference
        let { cardArt } = productDetailData.body.data;   
        if (cardArt.length>0) {
          cardArt.forEach(cardAr => {                  
            expect(cardAr.imageUri.length).to.not.eq(0);           
          })
        }   
      })
  
      it('check bundles', () => {
        let { bundles } = productDetailData.body.data;    
        if (bundles.length>0) {
          bundles.forEach(bundle => {           
            expect(bundle.name.length).to.not.eq(0); 
            expect(bundle.description.length).to.not.eq(0); 
          })
        }   
      })
  
      it('check features', () => {
        let { features } = productDetailData.body.data;    
        if (features.length>0) {
          features.forEach(feature => {                
            expect(FEATURE_TYPE[feature.featureType]).to.be.eq(feature.featureType); 
          })
        }   
      })
      
      it('check constraints', () => {
        let { constraints } = productDetailData.body.data;    
        if (constraints.length>0) {
          constraints.forEach(constraint => {                
            expect(CONSTRAINT_TYPE[constraint.constraintType]).to.be.eq(constraint.constraintType); 
          })
        }   
      })
  
      it('check eligibility', () => {
        let { eligibility } = productDetailData.body.data;    
        if (eligibility.length>0) {
          expect(ELIGIBILITY_TYPE[eligibility.eligibilityType]).to.be.eq(eligibility.eligibilityType);         
        }   
      })
  
      it('check fees', () => {
        let { fees } = productDetailData.body.data;    
        if (fees.length>0) {
          fees.forEach(fee => {         
            expect(fee.name.length).to.not.eq(0);          
            expect(FEE_TYPE[fee.feeType]).to.be.eq(fee.feeType); 
          })
        }   
      })
  
      it('check depositRates', () => {
        let { depositRates } = productDetailData.body.data;    
        if (depositRates.length>0) {
          depositRates.forEach(depositRate => {    
            expect(DEPOSIT_RATE_TYPE[depositRate.depositRateType]).to.be.eq(depositRate.depositRateType); 
            const res = RateStringRegex.test(depositRate.rate);
            expect(res).to.be.eq(true);          
       
            if (depositRate.tiers.length>0) {
              depositRate.tiers.forEach(tier => {               
                expect(tier.name.length).to.not.eq(0);          
                expect(UNIT_OF_MEASURE[tier.unitOfMeasure]).to.be.eq(tier.unitOfMeasure); 
                expect(typeof(tier.minimumValue)).to.be.eq('number');              
              })
            }   
  
          })
        }   
      })
  
      it('check lendingRates', () => {
        let { lendingRates } = productDetailData.body.data;    
        if (lendingRates.length>0) {
          lendingRates.forEach(lendingRate => {   
            expect(LENDING_RATE_TYPE[lendingRate.lendingRateType]).to.be.eq(lendingRate.lendingRateType); 
            const res = RateStringRegex.test(lendingRate.rate);
            expect(res).to.be.eq(true);          
       
           if (lendingRate.tiers.length>0) {
              lendingRate.tiers.forEach(tier => {              
                expect(tier.name.length).to.not.eq(0);          
                expect(UNIT_OF_MEASURE[tier.unitOfMeasure]).to.be.eq(tier.unitOfMeasure); 
                expect(typeof(tier.minimumValue)).to.be.eq('number');              
              })
            } 
  
          })
        }   
      })
     
    })

  })
})