import request from '../config/common.js';

export const getProducts = async () => {
	const res = await request
		.get('/products')
		.set('x-v', 3);

	return res;
}