import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AUTH_HEADER, createTestApp, Prisma } from './helpers';

describe('BotDeliveredMessages (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: Prisma;
  let userId: number;

  beforeAll(async () => {
    ({ app, prisma } = await createTestApp());
    const user = await prisma.user.create({
      data: { username: `e2e-bdm-user-${Date.now()}` },
    });
    userId = user.id;
    await prisma.messageDelivery.create({
      data: { userId, message: 'hello from bot' },
    });
  }, 30_000);

  afterAll(async () => {
    await prisma.messageDelivery.deleteMany({ where: { userId } });
    await prisma.user.deleteMany({ where: { id: userId } });
    await app.close();
  });

  describe('GET /api/v1/bot-delivered-messages', () => {
    it('returns paginated list', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/bot-delivered-messages')
        .set('Authorization', AUTH_HEADER)
        .expect(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(typeof res.body.count).toBe('number');
    });

    it('filters by userId', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/bot-delivered-messages?userId=${userId}`)
        .set('Authorization', AUTH_HEADER)
        .expect(200);
      expect(
        res.body.data.every((m: { userId: number }) => m.userId === userId),
      ).toBe(true);
    });

    it('returns 401 without auth', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/bot-delivered-messages')
        .expect(401);
    });
  });
});
