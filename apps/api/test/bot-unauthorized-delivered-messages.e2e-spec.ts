import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AUTH_HEADER, createTestApp, Prisma } from './helpers';

describe('BotUnauthorizedDeliveredMessages (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: Prisma;
  let createdId: number;

  const payload = {
    message: 'hello unauthorized',
    telegramId: 'e2e-unauth-tg-id',
  };

  beforeAll(async () => {
    ({ app, prisma } = await createTestApp());
    const res = await request(app.getHttpServer())
      .post('/api/v1/bot-unauthorized-delivered-messages')
      .set('Authorization', AUTH_HEADER)
      .send(payload)
      .expect(201);
    createdId = res.body.id;
  }, 30_000);

  afterAll(async () => {
    await prisma.botUnauthorizedMessageDelivery.deleteMany({
      where: { id: createdId },
    });
    await app.close();
  });

  describe('POST /api/v1/bot-unauthorized-delivered-messages', () => {
    it('creates a record', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/bot-unauthorized-delivered-messages')
        .set('Authorization', AUTH_HEADER)
        .send(payload)
        .expect(201);
      expect(res.body.message).toBe(payload.message);
      await prisma.botUnauthorizedMessageDelivery.deleteMany({
        where: { id: res.body.id },
      });
    });

    it('rejects payload without required message (400)', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/bot-unauthorized-delivered-messages')
        .set('Authorization', AUTH_HEADER)
        .send({ telegramId: 'x' })
        .expect(400);
    });

    it('returns 401 without auth', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/bot-unauthorized-delivered-messages')
        .send(payload)
        .expect(401);
    });
  });

  describe('GET /api/v1/bot-unauthorized-delivered-messages', () => {
    it('returns paginated list', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/bot-unauthorized-delivered-messages')
        .set('Authorization', AUTH_HEADER)
        .expect(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(typeof res.body.count).toBe('number');
    });

    it('returns 401 without auth', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/bot-unauthorized-delivered-messages')
        .expect(401);
    });
  });

  describe('GET /api/v1/bot-unauthorized-delivered-messages/:id', () => {
    it('returns record by id', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/bot-unauthorized-delivered-messages/${createdId}`)
        .set('Authorization', AUTH_HEADER)
        .expect(200);
      expect(res.body.id).toBe(createdId);
    });
  });

  describe('PATCH /api/v1/bot-unauthorized-delivered-messages/:id', () => {
    it('allows partial update (only message)', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/v1/bot-unauthorized-delivered-messages/${createdId}`)
        .set('Authorization', AUTH_HEADER)
        .send({ message: 'updated' })
        .expect(200);
      expect(res.body.message).toBe('updated');
    });

    it('returns 401 without auth', async () => {
      await request(app.getHttpServer())
        .patch(`/api/v1/bot-unauthorized-delivered-messages/${createdId}`)
        .send({ message: 'x' })
        .expect(401);
    });
  });

  describe('DELETE /api/v1/bot-unauthorized-delivered-messages/:id', () => {
    it('deletes a record', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/bot-unauthorized-delivered-messages')
        .set('Authorization', AUTH_HEADER)
        .send(payload)
        .expect(201);

      await request(app.getHttpServer())
        .delete(`/api/v1/bot-unauthorized-delivered-messages/${res.body.id}`)
        .set('Authorization', AUTH_HEADER)
        .expect(200);
    });

    it('returns 401 without auth', async () => {
      await request(app.getHttpServer())
        .delete(`/api/v1/bot-unauthorized-delivered-messages/${createdId}`)
        .expect(401);
    });
  });
});
