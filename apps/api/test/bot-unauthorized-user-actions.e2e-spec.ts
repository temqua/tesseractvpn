import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AUTH_HEADER, createTestApp, Prisma } from './helpers';

describe('BotUnauthorizedUserActions (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: Prisma;
  let createdId: number;

  const payload = {
    telegramId: 'e2e-unauth-action-tg',
    firstName: 'Test',
    lastName: 'User',
    username: 'test_user',
    isBot: false,
    command: '/start',
    action: 'start',
    languageCode: 'ru',
  };

  beforeAll(async () => {
    ({ app, prisma } = await createTestApp());
    const res = await request(app.getHttpServer())
      .post('/api/v1/bot-unauthorized-user-actions')
      .set('Authorization', AUTH_HEADER)
      .send(payload)
      .expect(201);
    createdId = res.body.id;
  }, 30_000);

  afterAll(async () => {
    await prisma.botUnauthorizedUserActions.deleteMany({
      where: { id: createdId },
    });
    await app.close();
  });

  describe('POST /api/v1/bot-unauthorized-user-actions', () => {
    it('creates a record', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/bot-unauthorized-user-actions')
        .set('Authorization', AUTH_HEADER)
        .send(payload)
        .expect(201);
      expect(res.body.telegramId).toBe(payload.telegramId);
      await prisma.botUnauthorizedUserActions.deleteMany({
        where: { id: res.body.id },
      });
    });

    it('rejects payload without required telegramId (400)', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/bot-unauthorized-user-actions')
        .set('Authorization', AUTH_HEADER)
        .send({ firstName: 'No tg' })
        .expect(400);
    });

    it('returns 401 without auth', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/bot-unauthorized-user-actions')
        .send(payload)
        .expect(401);
    });
  });

  describe('GET /api/v1/bot-unauthorized-user-actions', () => {
    it('returns list as plain array', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/bot-unauthorized-user-actions')
        .set('Authorization', AUTH_HEADER)
        .expect(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('returns 401 without auth', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/bot-unauthorized-user-actions')
        .expect(401);
    });
  });

  describe('GET /api/v1/bot-unauthorized-user-actions/:id', () => {
    it('returns record by id', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/bot-unauthorized-user-actions/${createdId}`)
        .set('Authorization', AUTH_HEADER)
        .expect(200);
      expect(res.body.id).toBe(createdId);
    });
  });

  describe('PATCH /api/v1/bot-unauthorized-user-actions/:id', () => {
    it('allows partial update (only action)', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/v1/bot-unauthorized-user-actions/${createdId}`)
        .set('Authorization', AUTH_HEADER)
        .send({ action: 'updated' })
        .expect(200);
      expect(res.body.action).toBe('updated');
      expect(res.body.telegramId).toBe(payload.telegramId);
    });

    it('returns 401 without auth', async () => {
      await request(app.getHttpServer())
        .patch(`/api/v1/bot-unauthorized-user-actions/${createdId}`)
        .send({ action: 'x' })
        .expect(401);
    });
  });

  describe('DELETE /api/v1/bot-unauthorized-user-actions/:id', () => {
    it('deletes a record', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/bot-unauthorized-user-actions')
        .set('Authorization', AUTH_HEADER)
        .send(payload)
        .expect(201);

      await request(app.getHttpServer())
        .delete(`/api/v1/bot-unauthorized-user-actions/${res.body.id}`)
        .set('Authorization', AUTH_HEADER)
        .expect(200);
    });

    it('returns 401 without auth', async () => {
      await request(app.getHttpServer())
        .delete(`/api/v1/bot-unauthorized-user-actions/${createdId}`)
        .expect(401);
    });
  });
});
