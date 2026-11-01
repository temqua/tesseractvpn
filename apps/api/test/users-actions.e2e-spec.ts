import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AUTH_HEADER, createTestApp, Prisma } from './helpers';

describe('UsersActions (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: Prisma;
  let userId: number;
  let createdId: number;

  beforeAll(async () => {
    ({ app, prisma } = await createTestApp());
    const user = await prisma.user.create({
      data: { username: `e2e-ua-user-${Date.now()}` },
    });
    userId = user.id;

    const res = await request(app.getHttpServer())
      .post(`/api/v1/users/${userId}/actions`)
      .set('Authorization', AUTH_HEADER)
      .send({ command: '/start', action: 'start' })
      .expect(201);
    createdId = res.body.id;
  }, 30_000);

  afterAll(async () => {
    await prisma.userAction.deleteMany({ where: { userId } });
    await prisma.user.deleteMany({ where: { id: userId } });
    await app.close();
  });

  describe('POST /api/v1/users/:userId/actions', () => {
    it('creates an action', async () => {
      const res = await request(app.getHttpServer())
        .post(`/api/v1/users/${userId}/actions`)
        .set('Authorization', AUTH_HEADER)
        .send({ command: '/help', action: 'help' })
        .expect(201);
      expect(res.body.command).toBe('/help');
      expect(res.body.userId).toBe(userId);
      await prisma.userAction.deleteMany({ where: { id: res.body.id } });
    });

    it('rejects payload without command (400)', async () => {
      await request(app.getHttpServer())
        .post(`/api/v1/users/${userId}/actions`)
        .set('Authorization', AUTH_HEADER)
        .send({ action: 'no-command' })
        .expect(400);
    });

    it('returns 401 without auth', async () => {
      await request(app.getHttpServer())
        .post(`/api/v1/users/${userId}/actions`)
        .send({ command: '/x' })
        .expect(401);
    });
  });

  describe('GET /api/v1/users/:userId/actions', () => {
    it('returns list as plain array', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/users/${userId}/actions`)
        .set('Authorization', AUTH_HEADER)
        .expect(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('returns 401 without auth', async () => {
      await request(app.getHttpServer())
        .get(`/api/v1/users/${userId}/actions`)
        .expect(401);
    });
  });

  describe('GET /api/v1/users/:userId/actions/:actionId', () => {
    it('returns action by id', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/users/${userId}/actions/${createdId}`)
        .set('Authorization', AUTH_HEADER)
        .expect(200);
      expect(res.body.id).toBe(createdId);
    });
  });

  describe('PATCH /api/v1/users/:userId/actions/:actionId', () => {
    it('allows partial update (only action)', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/v1/users/${userId}/actions/${createdId}`)
        .set('Authorization', AUTH_HEADER)
        .send({ action: 'updated' })
        .expect(200);
      expect(res.body.action).toBe('updated');
      expect(res.body.command).toBe('/start');
    });

    it('returns 401 without auth', async () => {
      await request(app.getHttpServer())
        .patch(`/api/v1/users/${userId}/actions/${createdId}`)
        .send({ action: 'x' })
        .expect(401);
    });
  });

  describe('DELETE /api/v1/users/:userId/actions/:actionId', () => {
    it('deletes an action', async () => {
      const res = await request(app.getHttpServer())
        .post(`/api/v1/users/${userId}/actions`)
        .set('Authorization', AUTH_HEADER)
        .send({ command: '/del' })
        .expect(201);

      await request(app.getHttpServer())
        .delete(`/api/v1/users/${userId}/actions/${res.body.id}`)
        .set('Authorization', AUTH_HEADER)
        .expect(200);
    });

    it('returns 401 without auth', async () => {
      await request(app.getHttpServer())
        .delete(`/api/v1/users/${userId}/actions/${createdId}`)
        .expect(401);
    });
  });
});
