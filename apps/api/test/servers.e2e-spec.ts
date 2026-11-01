import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AUTH_HEADER, createTestApp, Prisma } from './helpers';

describe('Servers (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: Prisma;
  let createdId: number;

  const payload = {
    name: 'Test Server e2e',
    url: 'https://vpn.test.example.com',
  };

  beforeAll(async () => {
    ({ app, prisma } = await createTestApp());
    const res = await request(app.getHttpServer())
      .post('/api/v1/servers')
      .set('Authorization', AUTH_HEADER)
      .send(payload)
      .expect(201);
    createdId = res.body.id;
  }, 30_000);

  afterAll(async () => {
    await prisma.vpnServer.deleteMany({ where: { id: createdId } });
    await app.close();
  });

  describe('POST /api/v1/servers', () => {
    it('creates a server', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/servers')
        .set('Authorization', AUTH_HEADER)
        .send(payload)
        .expect(201);
      expect(res.body.name).toBe(payload.name);
      expect(res.body.url).toBe(payload.url);
      await prisma.vpnServer.deleteMany({ where: { id: res.body.id } });
    });

    it('rejects payload without required url (400)', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/servers')
        .set('Authorization', AUTH_HEADER)
        .send({ name: 'no url' })
        .expect(400);
    });

    it('returns 401 without auth', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/servers')
        .send(payload)
        .expect(401);
    });
  });

  describe('GET /api/v1/servers', () => {
    it('returns paginated list', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/servers')
        .set('Authorization', AUTH_HEADER)
        .expect(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('returns 401 without auth', async () => {
      await request(app.getHttpServer()).get('/api/v1/servers').expect(401);
    });
  });

  describe('GET /api/v1/servers/:id', () => {
    it('returns server by id', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/servers/${createdId}`)
        .set('Authorization', AUTH_HEADER)
        .expect(200);
      expect(res.body.id).toBe(createdId);
    });
  });

  describe('PATCH /api/v1/servers/:id', () => {
    it('allows partial update (only name)', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/v1/servers/${createdId}`)
        .set('Authorization', AUTH_HEADER)
        .send({ name: 'Renamed Server' })
        .expect(200);
      expect(res.body.name).toBe('Renamed Server');
      expect(res.body.url).toBe(payload.url);
    });

    it('returns 401 without auth', async () => {
      await request(app.getHttpServer())
        .patch(`/api/v1/servers/${createdId}`)
        .send({ name: 'x' })
        .expect(401);
    });
  });

  describe('DELETE /api/v1/servers/:id', () => {
    it('deletes a server', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/servers')
        .set('Authorization', AUTH_HEADER)
        .send(payload)
        .expect(201);

      await request(app.getHttpServer())
        .delete(`/api/v1/servers/${res.body.id}`)
        .set('Authorization', AUTH_HEADER)
        .expect(200);
    });

    it('returns 401 without auth', async () => {
      await request(app.getHttpServer())
        .delete(`/api/v1/servers/${createdId}`)
        .expect(401);
    });
  });
});
