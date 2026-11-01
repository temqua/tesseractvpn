import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AUTH_HEADER, createTestApp } from './helpers';

describe('Jobs (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    ({ app } = await createTestApp());
  }, 30_000);

  afterAll(async () => {
    await app.close();
  });

  describe('GET /api/v1/jobs', () => {
    it('returns list of available jobs', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/jobs')
        .set('Authorization', AUTH_HEADER)
        .expect(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toEqual(
        expect.arrayContaining([
          'deactivate_unpaid',
          'show_unpaid',
          'notify_unpaid',
        ]),
      );
    });

    it('returns 401 without auth', async () => {
      await request(app.getHttpServer()).get('/api/v1/jobs').expect(401);
    });
  });

  describe('POST /api/v1/jobs/:name/execute', () => {
    it('returns 404 for unknown job', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/jobs/unknown_job/execute')
        .set('Authorization', AUTH_HEADER)
        .send({})
        .expect(404);
    });

    it('returns 401 without auth', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/jobs/deactivate_unpaid/execute')
        .send({})
        .expect(401);
    });
  });
});
