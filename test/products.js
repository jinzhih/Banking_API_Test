import chai, { expect } from 'chai';
import chaiSorted from 'chai-sorted';
import faker from 'faker';
import addContext from 'mochawesome/addContext.js';
import request from '../config/common.js';
import { getProducts } from '../helper/product_helper.js';
import { getStandardProducts } from '../helper/csv_helper.js';
import { isObject, isValidURL, isNaturalNumber, isArray } from '../utils/type.js';
import { PAGINATION, HEADERS_STANDARD } from '../constants/rules.js';
import { EFFECTIVE, PRODUCT_CATEGORY, PRODUCT_CATEGORY_ARRAY } from '../constants/enum.js';
import { BankingProductV3Schema } from '../schema/BankingProductV3.js';
import { getProductsByEffective, schemaValueCheck } from '../utils/tool.js';
import qa from '../config/qa.js';

chai.use(chaiSorted);

describe('Get Products', () => {
  let productsData;
  let standardProducts;

  before(async () => {
    standardProducts = await getStandardProducts();
  })

  describe('Negative testing', () => {
    it('Return error when missing x-v field in request header', async () => {
      const res = await request.get('/products')
      expect(res.statusCode).to.be.eq(406);
      expect(res.body).to.have.property('errors');
    })

    it('Return error when enter invalid x-v field in request header', async () => {
      const randomValue = faker.lorem.word();
      const res = await request
        .get('/products')
        .set('x-v', randomValue)
      expect(res.statusCode).to.be.eq(406);
      expect(res.body).to.have.property('errors');
    })

    it('Return error when x-v value is greater than current highest version', async () => {
      const randomNumber = faker.datatype.number({ min: Number(qa.currentVersion) + 1 });
      const res = await request
        .get('/products')
        .set('x-v', randomNumber)
      expect(res.statusCode).to.be.eq(406);
      expect(res.body).to.have.property('errors');
    })

    it('Return error when set an unacceptable Accept value in request header', async () => {
      const randomValue = faker.lorem.word();
      if (randomValue !== HEADERS_STANDARD.CONTENT_TYPE) {
        const res = await request
          .get('/products')
          .set('x-v', qa.currentVersion)
          .set('Accept', randomValue)
        expect(res.statusCode).to.be.eq(406);
        expect(res.body).to.have.property('errors');
      }
    })
  })

  describe('Get Products without query string', () => {
    before(async () => {
      productsData = await getProducts();
    })

    it('get correct format of response header', function () {
      const { header } = productsData;
      expect(header['x-v']).to.be.eq(qa.currentVersion);
      expect(header['content-type']).to.be.eq(HEADERS_STANDARD.CONTENT_TYPE);

      if (!header.hasOwnProperty('x-fapi-interaction-id')) {
        addContext(this, {
          title: 'Missing mandatory field: x-fapi-interaction-id on response headers',
          value: header,
        });
      }
      expect(header.hasOwnProperty('x-fapi-interaction-id')).to.be.eq(
        true,
        'Missing mandatory field: x-fapi-interaction-id on response headers',
      );

      if (header.hasOwnProperty('retry-after')) {
        expect(header['retry-after']).to.be.a('number');
        expect(productsData.statusCode).to.be.eq(429);
      }
    })

    it('contains data property and the type is object', () => {
      expect(productsData.body).to.have.property('data');
      expect(isObject(productsData.body.data)).to.be.true;
    })

    it('contains products property and the type is array', () => {
      expect(productsData.body.data).to.have.property('products');
      expect(isArray(productsData.body.data.products)).to.be.true;
    })

    it('contains links property and the type is correct', () => {
      expect(productsData.body).to.have.property('links');
      expect(productsData.body.links).to.have.property('self');
      expect(isValidURL(productsData.body.links.self)).to.be.true;
    })

    it('contains meta property and the type is correct', () => {
      const { totalRecords, totalPages } = productsData.body.meta;
      expect(productsData.body).to.have.property('meta');
      expect(productsData.body.meta).to.have.property('totalRecords');
      expect(isNaturalNumber(totalRecords)).to.be.true;
      expect(productsData.body.meta).to.have.property('totalPages');
      expect(isNaturalNumber(totalPages)).to.be.true;
    })

    it('have standard pagination', () => {
      let { totalPages } = productsData.body.meta;
      const { products } = productsData.body.data;
      if (totalPages > 1) {
        expect(products).to.have.lengthOf(PAGINATION.STANDARD_PAGINATION);
      }
    })

    it('products should ordered in descending order according to lastUpdated', () => {
      const { products } = productsData.body.data;
      expect(products).to.be.descendingBy('lastUpdated');
    })

    it('Products property do not contains invalid products schema', async function () {
      let errorArray = [];
      const { products } = productsData.body.data;
      if (products.length) {
        await products.forEach(product => {
          const res = BankingProductV3Schema.validate(product)
          if (res.error) {
            errorArray = errorArray.concat(res.error);
          }
        })
      }
      if (errorArray.length) {
        addContext(this, {
          title: 'Incorrect product schema',
          value: errorArray,
        });
      }
      expect(errorArray.length).to.be.eq(0);
    })

    it('products property do not contains unmatched value', async function () {
      const { products } = productsData.body.data;
      let errorArray = [];
      if (products.length) {
        products.forEach(product => {
          const standardData = standardProducts.filter(i => product.productId === i.productId)[0];
          const error = schemaValueCheck(product, standardData);
          if (error.length) {
            errorArray = errorArray.concat(error);
          }
        })
      }
      if (errorArray.length) {
        addContext(this, {
          title: 'Unmatched field value',
          value: errorArray,
        });
      }
      expect(errorArray.length).to.be.eq(0);
    })
  })

  describe('Get Products with query string', () => {
    describe('Get Products with page query', () => {
      let totalPages;

      context('get mandatory properties when its not the last page', () => {
        before(async () => {
          // TODO May be need to generate a random page number (Faker.js)
          productsData = await getProducts('page=1');
          totalPages = productsData.body.meta.totalPages;
        })

        it('have standard pagination', () => {
          const { products } = productsData.body.data;
          if (totalPages > 1) {
            return expect(products).to.have.lengthOf(PAGINATION.STANDARD_PAGINATION);
          }
        })

        it('have last properties inside the links when its not the last page', () => {
          if (totalPages > 1) {
            return expect(productsData.body.links).to.have.property('last');
          }
        })

        it('have next properties inside the links when its not the last page', () => {
          if (totalPages > 1) {
            return expect(productsData.body.links).to.have.property('next');
          }
        })
      })

      context('get mandatory properties when its not the first page', () => {
        before(async () => {
          // TODO May be need to generate a random page number (Faker.js)
          productsData = await getProducts('page=2');
          totalPages = productsData.body.meta.totalPages;
        })

        it('have first properties inside the links when its not the first page', () => {
          if (totalPages > 1) {
            expect(productsData.body.links).to.have.property('first');
          }
        })

        it('have prev properties inside the links when its not the first page', () => {
          if (totalPages > 1) {
            expect(productsData.body.links).to.have.property('prev');
          }
        })
      })
    })

    describe('Get Products with page-size query', () => {
      let totalRecords;

      context('Negative testing', () => {
        it('Return error when page-size parameter value is incorrect', async () => {
          const randowValue = faker.lorem.word();
          if (!isNaturalNumber(randowValue)) {
            productsData = await getProducts(`page-size=${randowValue}`)
            expect(productsData.statusCode).to.be.eq(400);
            expect(productsData.body).to.have.property('errors');
          }
        })

        it('Return error when page-size parameter value too small (less than 1)', async () => {
          const randowNumber = faker.datatype.number();
          let pageSize;
          if (randowNumber === 0) {
            pageSize = 0;
          } else {
            pageSize = faker.datatype.number() * -1;
          }
          productsData = await getProducts(`page-size=${pageSize}`)
          expect(productsData.statusCode).to.be.eq(422);
          expect(productsData.body).to.have.property('errors');
        })

        it('Return error when page-size parameter value too large (greater than 1000)', async () => {
          const pageSize = faker.datatype.number({ min: PAGINATION.MAX_PAGE_SIZE + 1 });
          productsData = await getProducts(`page-size=${pageSize}`)
          expect(productsData.statusCode).to.be.eq(422);
          expect(productsData.body).to.have.property('errors');
        })
      })

      context('get correct page size when there is correct parameter page-size query', () => {
        let pageSize;
        before(async () => {
          productsData = await getProducts();
          totalRecords = productsData.body.meta.totalRecords;
        })

        it('having correct page-size when page-size is no greater than totalRecords', async () => {
          pageSize = faker.datatype.number({ min: 1, max: totalRecords });
          productsData = await getProducts(`page-size=${pageSize}`);
          const { products } = productsData.body.data;
          expect(products).to.have.lengthOf(pageSize);
        })

        it('having correct page-size when page-size is greater than totalRecords', async () => {
          pageSize = faker.datatype.number({ min: totalRecords + 1, max: PAGINATION.MAX_PAGE_SIZE });
          productsData = await getProducts(`page-size=${pageSize}`);
          const { products } = productsData.body.data;
          expect(products).to.have.lengthOf(totalRecords);
        })
      })
    })

    describe('Get Products with effective query', () => {
      it('validate query string parameter value', async () => {
        const randomValue = faker.lorem.word();
        if (!EFFECTIVE[randomValue]) {
          productsData = await getProducts(`effective=${randomValue}`);
          expect(productsData.status).to.be.eq(400);
          expect(productsData.body.errors[0].title).to.be.eq('Invalid query string parameter value');
        }
      })

      it('get correct result when query string parameter value is ALL', async () => {
        productsData = await getProducts(`effective=${EFFECTIVE.ALL}`);
        const { totalRecords } = productsData.body.meta;
        if (totalRecords === 0) return;
        if (totalRecords > 25) {
          productsData = await getProducts(`effective=${EFFECTIVE.ALL}&page-size=${totalRecords}`);
        }
        const { products } = productsData.body.data;
        expect(products.length).to.be.eq(totalRecords);
      })

      it('get correct result when query string parameter value is FUTURE', async () => {
        productsData = await getProducts(`effective=${EFFECTIVE.FUTURE}`);
        const { totalRecords } = productsData.body.meta;
        if (totalRecords) {
          if (totalRecords > 25) {
            productsData = await getProducts(`effective=${EFFECTIVE.FUTURE}&page-size=${totalRecords}`);
          }
          const { products } = productsData.body.data;
          const futureProducts = getProductsByEffective(products, EFFECTIVE.FUTURE);
          expect(products.length).to.be.eq(futureProducts.length);
        }
      })
      // TODO Confirm the effective filter
      it('get correct result when query string parameter value is CURRENT', async function () {
        productsData = await getProducts(`effective=${EFFECTIVE.CURRENT}`);
        const { totalRecords } = productsData.body.meta;
        if (totalRecords === 0) return;
        const totalProductsData = await getProducts(`effective=${EFFECTIVE.CURRENT}&page-size=${totalRecords}`);
        const { products } = totalProductsData.body.data;
        const currentProducts = getProductsByEffective(products, EFFECTIVE.CURRENT);
        if (products.length !== currentProducts.length) {
          addContext(this, {
            title: 'Incorrect effective filter',
            value: products,
          });
        }
        // console.log(currentProducts);
        expect(products.length).to.be.eq(currentProducts.length);
      })
    })

    describe('Get Products with updated-since query', () => {
      it('validate query string parameter value', async () => {
        const randomValue = faker.lorem.word();
        const randomDate = new Date(randomValue);
        if (randomDate.toString() === 'Invalid Date') {
          productsData = await getProducts(`updated-since=${randomValue}`);
          expect(productsData.status).to.be.eq(400);
          expect(productsData.body.errors[0].title).to.be.eq('Invalid query string parameter value');
        }
      })

      it('Do not contains unmatched products when updated-since parameter value is valid', async () => {
        const randomDate = faker.date.past(1).toISOString();
        productsData = await getProducts(`updated-since=${randomDate}`);
        const { totalRecords } = productsData.body.meta;
        if (totalRecords === 0) return;
        if (totalRecords > 25) {
          productsData = await getProducts(`updated-since=${randomDate}&page-size=${totalRecords}`);
        }
        const { products } = productsData.body.data;
        const invalidProducts = products.filter(product => {
          const queryTime = new Date(randomDate).getTime();
          const lastUpdatedTime = new Date(product.lastUpdated).getTime();
          return queryTime - lastUpdatedTime > 0;
        });
        expect(invalidProducts.length).to.be.eq(0);
      })
    })

    describe('Get Products with brand query', () => {
      it('return empty array when enter invalid brand value', async () => {
        const randomBrand = faker.lorem.word();
        if (randomBrand !== qa.brand) {
          productsData = await getProducts(`brand=${randomBrand}`);
          const { products } = productsData.body.data;
          expect(products.length).to.be.eq(0);
        }
      })

      it('Do not contains unmatched products when brand parameter value is valid', async () => {
        productsData = await getProducts(`brand=${qa.brand}`);
        const { products } = productsData.body.data;
        const inValidProducts = products.filter(product => product.brand !== qa.brand);
        expect(inValidProducts.length).to.be.eq(0);
      })
    })

    describe('Get Products with product-category query', () => {
      it('return error when product-category parameter value is invalid', async () => {
        const randomCategory = faker.lorem.word();
        if (!PRODUCT_CATEGORY[randomCategory]) {
          productsData = await getProducts(`product-category=${randomCategory}`);
          expect(productsData.status).to.be.eq(400);
          expect(productsData.body.errors[0].title).to.be.eq('Invalid query string parameter value');
        }
      })

      it('Do not return unmatched products when enter a valid product-category value', async () => {
        // TODO Do we need to pass all the product-category separately, and run the test?
        // For now, we just pass a valid category randomly
        const randomIndex = faker.datatype.number(PRODUCT_CATEGORY_ARRAY.length - 1);
        const randomCategory = PRODUCT_CATEGORY_ARRAY[randomIndex];
        productsData = await getProducts(`product-category=${randomCategory}`);
        let unmatchedProducts = [];
        const { products } = productsData.body.data;
        if (products.length) {
          unmatchedProducts = products.filter(product => product.productCategory !== randomCategory)
        }
        expect(unmatchedProducts).to.have.lengthOf(0);
      })
    })
  })
})
