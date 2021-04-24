import chai, { expect } from 'chai';
import chaiSorted from 'chai-sorted';
import { getProducts } from '../helper/product_helper.js';
import { isObject, isValidURL, isNaturalNumber, isArray } from '../utils/type.js';
import { PAGINATION } from '../rules/products.js';

chai.use(chaiSorted);

describe('Get Products', () => {
  let productsData;

  describe('Get Products without query string', () => {
    before(async () => {
      productsData = await getProducts();
    })

    it('get correct format of response', () => {
      expect(productsData.status).to.be.eq(200);
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
      expect(productsData.body).to.have.property('meta');
      expect(productsData.body.meta).to.have.property('totalRecords');
      expect(isNaturalNumber(productsData.body.meta.totalRecords)).to.be.true;
      expect(productsData.body.meta).to.have.property('totalPages');
      expect(isNaturalNumber(productsData.body.meta.totalPages)).to.be.true;
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
  })

  describe('Get Products with query string', () => {
    describe('Get Products with page query', () => {
      let productsData;
      let totalPages;

      describe('get mandatory properties when its not the last page', () => {
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

      describe('get mandatory properties when its not the first page', () => {
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
  })
})

