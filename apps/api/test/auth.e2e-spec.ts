import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { createTestApp } from './helpers';

describe('Auth (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    ({ app } = await createTestApp());
  }, 30_000);

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/v1/auth', () => {
    it('returns 404 for unknown username (public endpoint)', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth')
        .send({ username: 'nonexistent-user', password: 'pass' })
        .expect(404);
    });
  });

  describe('POST /api/v1/auth/tg', () => {
    it('returns 404 for unknown telegram id (public endpoint)', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/tg')
        .send({ tgToken: 'token', telegramId: '000000000' })
        .expect(404);
    });
  });
});
