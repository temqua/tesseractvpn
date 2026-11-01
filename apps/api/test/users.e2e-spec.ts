import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AUTH_HEADER, createTestApp, Prisma } from './helpers';

describe('Users (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: Prisma;
  let createdId: number;
  const username = `e2e-user-${Date.now()}`;

  beforeAll(async () => {
    ({ app, prisma } = await createTestApp());
    const res = await request(app.getHttpServer())
      .post('/api/v1/users')
      .set('Authorization', AUTH_HEADER)
      .send({ username, firstName: 'Test', lastName: 'User' })
      .expect(201);
    createdId = res.body.id;
  }, 30_000);

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { id: createdId } });
    await app.close();
  });

  describe('POST /api/v1/users', () => {
    it('creates a user', async () => {
      const u = `${username}-2`;
      const res = await request(app.getHttpServer())
        .post('/api/v1/users')
        .set('Authorization', AUTH_HEADER)
        .send({ username: u, firstName: 'New' })
        .expect(201);
      expect(res.body.username).toBe(u);
      await prisma.user.deleteMany({ where: { id: res.body.id } });
    });

    it('rejects payload without required username (400)', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/users')
        .set('Authorization', AUTH_HEADER)
        .send({ firstName: 'No username' })
        .expect(400);
    });

    it('returns 401 without auth', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/users')
        .send({ username: `${username}-3` })
        .expect(401);
    });
  });

  describe('GET /api/v1/users', () => {
    it('returns paginated list', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/users')
        .set('Authorization', AUTH_HEADER)
        .expect(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(typeof res.body.count).toBe('number');
    });

    it('filters by username', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/users?username=${username}`)
        .set('Authorization', AUTH_HEADER)
        .expect(200);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
      expect(
        res.body.data.every(
          (u: { username: string }) => u.username === username,
        ),
      ).toBe(true);
    });

    it('returns 401 without auth', async () => {
      await request(app.getHttpServer()).get('/api/v1/users').expect(401);
    });
  });

  describe('GET /api/v1/users/:id', () => {
    it('returns user by id', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/users/${createdId}`)
        .set('Authorization', AUTH_HEADER)
        .expect(200);
      expect(res.body.id).toBe(createdId);
    });

    it('returns 404 for unknown id', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/users/999999999')
        .set('Authorization', AUTH_HEADER)
        .expect(404);
    });
  });

  describe('PATCH /api/v1/users/:id', () => {
    it('allows partial update (only firstName)', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/v1/users/${createdId}`)
        .set('Authorization', AUTH_HEADER)
        .send({ firstName: 'UpdatedName' })
        .expect(200);
      expect(res.body.firstName).toBe('UpdatedName');
      expect(res.body.username).toBe(username);
    });

    it('returns 401 without auth', async () => {
      await request(app.getHttpServer())
        .patch(`/api/v1/users/${createdId}`)
        .send({ firstName: 'x' })
        .expect(401);
    });
  });

  describe('DELETE /api/v1/users/:id', () => {
    it('deletes a user', async () => {
      const u = `${username}-del`;
      const res = await request(app.getHttpServer())
        .post('/api/v1/users')
        .set('Authorization', AUTH_HEADER)
        .send({ username: u })
        .expect(201);

      await request(app.getHttpServer())
        .delete(`/api/v1/users/${res.body.id}`)
        .set('Authorization', AUTH_HEADER)
        .expect(200);
    });

    it('returns 401 without auth', async () => {
      await request(app.getHttpServer())
        .delete(`/api/v1/users/${createdId}`)
        .expect(401);
    });
  });
});
