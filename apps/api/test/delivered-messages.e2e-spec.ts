import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AUTH_HEADER, createTestApp, Prisma } from './helpers';

describe('DeliveredMessages (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: Prisma;
  let userId: number;
  let createdId: number;

  beforeAll(async () => {
    ({ app, prisma } = await createTestApp());
    const user = await prisma.user.create({
      data: { username: `e2e-dm-user-${Date.now()}` },
    });
    userId = user.id;

    const res = await request(app.getHttpServer())
      .post(`/api/v1/users/${userId}/delivered-messages`)
      .set('Authorization', AUTH_HEADER)
      .send({ message: 'hello' })
      .expect(201);
    createdId = res.body.id;
  }, 30_000);

  afterAll(async () => {
    await prisma.messageDelivery.deleteMany({ where: { userId } });
    await prisma.user.deleteMany({ where: { id: userId } });
    await app.close();
  });

  describe('POST /api/v1/users/:userId/delivered-messages', () => {
    it('creates a message', async () => {
      const res = await request(app.getHttpServer())
        .post(`/api/v1/users/${userId}/delivered-messages`)
        .set('Authorization', AUTH_HEADER)
        .send({ message: 'hello again' })
        .expect(201);
      expect(res.body.message).toBe('hello again');
      expect(res.body.userId).toBe(userId);
      await prisma.messageDelivery.deleteMany({ where: { id: res.body.id } });
    });

    it('rejects payload without message (400)', async () => {
      await request(app.getHttpServer())
        .post(`/api/v1/users/${userId}/delivered-messages`)
        .set('Authorization', AUTH_HEADER)
        .send({})
        .expect(400);
    });

    it('returns 401 without auth', async () => {
      await request(app.getHttpServer())
        .post(`/api/v1/users/${userId}/delivered-messages`)
        .send({ message: 'x' })
        .expect(401);
    });
  });

  describe('GET /api/v1/users/:userId/delivered-messages', () => {
    it('returns list as plain array', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/users/${userId}/delivered-messages`)
        .set('Authorization', AUTH_HEADER)
        .expect(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('returns 401 without auth', async () => {
      await request(app.getHttpServer())
        .get(`/api/v1/users/${userId}/delivered-messages`)
        .expect(401);
    });
  });

  describe('GET /api/v1/users/:userId/delivered-messages/:id', () => {
    it('returns message by id', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/users/${userId}/delivered-messages/${createdId}`)
        .set('Authorization', AUTH_HEADER)
        .expect(200);
      expect(res.body.id).toBe(createdId);
    });
  });

  describe('PATCH /api/v1/users/:userId/delivered-messages/:id', () => {
    it('allows partial update (only message)', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/v1/users/${userId}/delivered-messages/${createdId}`)
        .set('Authorization', AUTH_HEADER)
        .send({ message: 'updated' })
        .expect(200);
      expect(res.body.message).toBe('updated');
    });

    it('returns 401 without auth', async () => {
      await request(app.getHttpServer())
        .patch(`/api/v1/users/${userId}/delivered-messages/${createdId}`)
        .send({ message: 'x' })
        .expect(401);
    });
  });

  describe('DELETE /api/v1/users/:userId/delivered-messages/:id', () => {
    it('deletes a message', async () => {
      const res = await request(app.getHttpServer())
        .post(`/api/v1/users/${userId}/delivered-messages`)
        .set('Authorization', AUTH_HEADER)
        .send({ message: 'to delete' })
        .expect(201);

      await request(app.getHttpServer())
        .delete(`/api/v1/users/${userId}/delivered-messages/${res.body.id}`)
        .set('Authorization', AUTH_HEADER)
        .expect(200);
    });

    it('returns 401 without auth', async () => {
      await request(app.getHttpServer())
        .delete(`/api/v1/users/${userId}/delivered-messages/${createdId}`)
        .expect(401);
    });
  });
});
