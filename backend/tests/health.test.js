import request from 'supertest';
import app from '../app.js';

describe('GET /api/health', () => {
  it('responds with status 200 and expected payload', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      status: 'UP',
      message: 'Tribotik Backend is running!'
    });
  });
});
