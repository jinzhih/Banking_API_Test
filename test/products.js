import request from '../config/common.js';

import chai, { expect } from 'chai';
import chaiSorted from 'chai-sorted';
import { getProducts } from '../helper/product_helper.js';
import { isObject, isValidURL, isNaturalNumber, isArray } from '../utils/type.js'

chai.use(chaiSorted);

describe('Get Products', () => {
	let productsData;

	before(async () => {
		productsData = await getProducts();
	})

	it('get correct format of response', () => {
		expect(productsData.status).to.be.eq(200);
	})

	it('contains data property and the type is object', async () => {
		expect(productsData.body).to.have.property('data');
		expect(isObject(productsData.body.data)).to.be.true;
	})

	it('contains products property and the type is array', async () => {
		expect(productsData.body.data).to.have.property('products');
		expect(isArray(productsData.body.data.products)).to.be.true;
	})

	it('contains links property and the type is correct', async () => {
		expect(productsData.body).to.have.property('links');
		expect(productsData.body.links).to.have.property('self');
		expect(isValidURL(productsData.body.links.self)).to.be.true;
	})

	it('contains meta property and the type is correct', async () => {
		expect(productsData.body).to.have.property('meta');
		expect(productsData.body.meta).to.have.property('totalRecords');
		expect(isNaturalNumber(productsData.body.meta.totalRecords)).to.be.true;
		expect(productsData.body.meta).to.have.property('totalPages');
		expect(isNaturalNumber(productsData.body.meta.totalPages)).to.be.true;
	})

	it('products should ordered in descending order according to lastUpdated', async () => {
		const { products } = productsData.body.data;
		console.log(productsData);
		expect(products).to.be.descendingBy("lastUpdated");
	})
})