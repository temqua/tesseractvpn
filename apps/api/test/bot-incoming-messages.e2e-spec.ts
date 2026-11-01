import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AUTH_HEADER, createTestApp, Prisma } from './helpers';

describe('BotIncomingMessages (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: Prisma;
  let createdId: number;

  const payload = {
    telegramId: 'e2e-tg-id',
    firstName: 'Test',
    lastName: 'User',
    username: 'test_user',
    isBot: false,
    languageCode: 'ru',
    text: 'hello',
  };

  beforeAll(async () => {
    ({ app, prisma } = await createTestApp());
    const res = await request(app.getHttpServer())
      .post('/api/v1/bot-incoming-messages')
      .set('Authorization', AUTH_HEADER)
      .send(payload)
      .expect(201);
    createdId = res.body.id;
  }, 30_000);

  afterAll(async () => {
    await prisma.botIncomingMessages.deleteMany({ where: { id: createdId } });
    await app.close();
  });

  describe('POST /api/v1/bot-incoming-messages', () => {
    it('creates a record', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/bot-incoming-messages')
        .set('Authorization', AUTH_HEADER)
        .send(payload)
        .expect(201);
      expect(res.body.telegramId).toBe(payload.telegramId);
      expect(res.body.firstName).toBe(payload.firstName);
      await prisma.botIncomingMessages.deleteMany({
        where: { id: res.body.id },
      });
    });

    it('rejects payload without required telegramId (400)', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/bot-incoming-messages')
        .set('Authorization', AUTH_HEADER)
        .send({ firstName: 'No tg' })
        .expect(400);
    });

    it('returns 401 without auth', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/bot-incoming-messages')
        .send(payload)
        .expect(401);
    });
  });

  describe('GET /api/v1/bot-incoming-messages', () => {
    it('returns paginated list', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/bot-incoming-messages')
        .set('Authorization', AUTH_HEADER)
        .expect(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(typeof res.body.count).toBe('number');
    });

    it('returns 401 without auth', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/bot-incoming-messages')
        .expect(401);
    });
  });

  describe('GET /api/v1/bot-incoming-messages/:id', () => {
    it('returns record by id', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/bot-incoming-messages/${createdId}`)
        .set('Authorization', AUTH_HEADER)
        .expect(200);
      expect(res.body.id).toBe(createdId);
    });

    it('returns 404 for unknown id', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/bot-incoming-messages/999999999')
        .set('Authorization', AUTH_HEADER)
        .expect(404);
    });
  });

  describe('PATCH /api/v1/bot-incoming-messages/:id', () => {
    it('allows partial update (only text)', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/v1/bot-incoming-messages/${createdId}`)
        .set('Authorization', AUTH_HEADER)
        .send({ text: 'updated' })
        .expect(200);
      expect(res.body.text).toBe('updated');
      expect(res.body.telegramId).toBe(payload.telegramId);
    });

    it('returns 401 without auth', async () => {
      await request(app.getHttpServer())
        .patch(`/api/v1/bot-incoming-messages/${createdId}`)
        .send({ text: 'x' })
        .expect(401);
    });
  });

  describe('DELETE /api/v1/bot-incoming-messages/:id', () => {
    it('deletes a record', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/bot-incoming-messages')
        .set('Authorization', AUTH_HEADER)
        .send(payload)
        .expect(201);

      await request(app.getHttpServer())
        .delete(`/api/v1/bot-incoming-messages/${res.body.id}`)
        .set('Authorization', AUTH_HEADER)
        .expect(200);
    });

    it('returns 401 without auth', async () => {
      await request(app.getHttpServer())
        .delete(`/api/v1/bot-incoming-messages/${createdId}`)
        .expect(401);
    });
  });
});
