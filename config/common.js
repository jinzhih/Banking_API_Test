import supertest from 'supertest';
import qa from '../config/qa.js';
const request = supertest(qa.baseUrl);

export default request;