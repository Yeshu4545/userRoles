const request = require('supertest');
const app = require('../server');

describe('Basic API smoke tests', () => {
  it('GET / should return API Running', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toMatch(/API Running/);
  });
});
