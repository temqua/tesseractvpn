import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AUTH_HEADER, createTestApp, Prisma } from './helpers';

describe('Plans (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: Prisma;
  let createdId: number;

  const payload = {
    name: 'Test Plan e2e',
    amount: 100,
    price: 100,
    minCount: 1,
    maxCount: 2,
    monthsCount: 1,
  };

  beforeAll(async () => {
    ({ app, prisma } = await createTestApp());
    const res = await request(app.getHttpServer())
      .post('/api/v1/plans')
      .set('Authorization', AUTH_HEADER)
      .send(payload)
      .expect(201);
    createdId = res.body.id;
  }, 30_000);

  afterAll(async () => {
    await prisma.plan.deleteMany({ where: { id: createdId } });
    await app.close();
  });

  describe('POST /api/v1/plans', () => {
    it('creates a plan', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/plans')
        .set('Authorization', AUTH_HEADER)
        .send(payload)
        .expect(201);
      expect(res.body.id).toBeDefined();
      expect(res.body.name).toBe(payload.name);
      await prisma.plan.deleteMany({ where: { id: res.body.id } });
    });

    it('rejects payload without required name (400)', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/plans')
        .set('Authorization', AUTH_HEADER)
        .send({ amount: 100 })
        .expect(400);
    });

    it('returns 401 without auth', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/plans')
        .send(payload)
        .expect(401);
    });
  });

  describe('GET /api/v1/plans', () => {
    it('returns paginated list', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/plans')
        .set('Authorization', AUTH_HEADER)
        .expect(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(typeof res.body.count).toBe('number');
    });

    it('returns 401 without auth', async () => {
      await request(app.getHttpServer()).get('/api/v1/plans').expect(401);
    });
  });

  describe('GET /api/v1/plans/:id', () => {
    it('returns plan by id', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/plans/${createdId}`)
        .set('Authorization', AUTH_HEADER)
        .expect(200);
      expect(res.body.id).toBe(createdId);
    });
  });

  describe('PATCH /api/v1/plans/:id', () => {
    it('allows partial update (only amount)', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/v1/plans/${createdId}`)
        .set('Authorization', AUTH_HEADER)
        .send({ amount: 999 })
        .expect(200);
      expect(res.body.amount).toBe(999);
      expect(res.body.name).toBe(payload.name);
    });

    it('returns 401 without auth', async () => {
      await request(app.getHttpServer())
        .patch(`/api/v1/plans/${createdId}`)
        .send({ amount: 1 })
        .expect(401);
    });
  });

  describe('DELETE /api/v1/plans/:id', () => {
    it('deletes a plan', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/plans')
        .set('Authorization', AUTH_HEADER)
        .send(payload)
        .expect(201);

      await request(app.getHttpServer())
        .delete(`/api/v1/plans/${res.body.id}`)
        .set('Authorization', AUTH_HEADER)
        .expect(200);
    });

    it('returns 401 without auth', async () => {
      await request(app.getHttpServer())
        .delete(`/api/v1/plans/${createdId}`)
        .expect(401);
    });
  });
});
