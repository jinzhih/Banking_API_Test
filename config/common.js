import supertest from 'supertest';
import qa from './qa.js';

const request = supertest(qa.baseUrl);

export default request;
