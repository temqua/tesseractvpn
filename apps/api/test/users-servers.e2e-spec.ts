import { INestApplication } from '@nestjs/common';
import { VPNProtocol } from '@prisma/client';
import request from 'supertest';
import { App } from 'supertest/types';
import { AUTH_HEADER, createTestApp, Prisma } from './helpers';

describe('UsersServers (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: Prisma;
  let userId: number;
  let serverId: number;
  let createdId: number;

  beforeAll(async () => {
    ({ app, prisma } = await createTestApp());

    const user = await prisma.user.create({
      data: { username: `e2e-us-user-${Date.now()}` },
    });
    userId = user.id;

    const server = await prisma.vpnServer.create({
      data: { name: 'e2e-us-server', url: 'https://e2e.example.com' },
    });
    serverId = server.id;

    const res = await request(app.getHttpServer())
      .post('/api/v1/users-servers')
      .set('Authorization', AUTH_HEADER)
      .send({
        serverId,
        userId,
        protocol: VPNProtocol.WireGuard,
        username: 'e2e-username',
      })
      .expect(201);
    createdId = res.body.id;
  }, 30_000);

  afterAll(async () => {
    await prisma.serversUsers.deleteMany({ where: { id: createdId } });
    await prisma.vpnServer.deleteMany({ where: { id: serverId } });
    await prisma.user.deleteMany({ where: { id: userId } });
    await app.close();
  });

  describe('POST /api/v1/users-servers', () => {
    it('creates a link', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/users-servers')
        .set('Authorization', AUTH_HEADER)
        .send({
          serverId,
          userId,
          protocol: VPNProtocol.WireGuard,
          username: 'e2e-username-2',
        })
        .expect(201);
      expect(res.body.serverId).toBe(serverId);
      expect(res.body.userId).toBe(userId);
      await prisma.serversUsers.deleteMany({ where: { id: res.body.id } });
    });

    it('rejects payload with invalid protocol (400)', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/users-servers')
        .set('Authorization', AUTH_HEADER)
        .send({
          serverId,
          userId,
          protocol: 'NOT_A_PROTOCOL',
          username: 'x',
        })
        .expect(400);
    });

    it('returns 401 without auth', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/users-servers')
        .send({
          serverId,
          userId,
          protocol: VPNProtocol.WireGuard,
          username: 'x',
        })
        .expect(401);
    });
  });

  describe('GET /api/v1/users-servers', () => {
    it('returns paginated list', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/users-servers')
        .set('Authorization', AUTH_HEADER)
        .expect(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(typeof res.body.count).toBe('number');
    });

    it('returns 401 without auth', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/users-servers')
        .expect(401);
    });
  });

  describe('GET /api/v1/users-servers/:id', () => {
    it('returns link by id', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/users-servers/${createdId}`)
        .set('Authorization', AUTH_HEADER)
        .expect(200);
      expect(res.body.id).toBe(createdId);
    });
  });

  describe('DELETE /api/v1/users-servers/:id', () => {
    it('deletes a link', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/users-servers')
        .set('Authorization', AUTH_HEADER)
        .send({
          serverId,
          userId,
          protocol: VPNProtocol.IKEv2,
          username: 'e2e-username-del',
        })
        .expect(201);

      await request(app.getHttpServer())
        .delete(`/api/v1/users-servers/${res.body.id}`)
        .set('Authorization', AUTH_HEADER)
        .expect(200);
    });

    it('returns 401 without auth', async () => {
      await request(app.getHttpServer())
        .delete(`/api/v1/users-servers/${createdId}`)
        .expect(401);
    });
  });
});
