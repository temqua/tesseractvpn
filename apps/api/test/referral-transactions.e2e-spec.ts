import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AUTH_HEADER, createTestApp, Prisma } from './helpers';

describe('ReferralTransactions (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: Prisma;
  let referrerId: number;
  let referredId: number;
  let paymentId: string;
  let createdId: string;
  const extraUsers: number[] = [];
  const extraPayments: string[] = [];

  beforeAll(async () => {
    ({ app, prisma } = await createTestApp());

    const referrer = await prisma.user.create({
      data: { username: `e2e-referrer-${Date.now()}` },
    });
    referrerId = referrer.id;

    const referred = await prisma.user.create({
      data: { username: `e2e-referred-${Date.now()}` },
    });
    referredId = referred.id;

    const payment = await prisma.payment.create({
      data: { userId: referredId, amount: 1500 },
    });
    paymentId = payment.id;

    const res = await request(app.getHttpServer())
      .post('/api/v1/referral-transactions')
      .set('Authorization', AUTH_HEADER)
      .send({ referrerId, referredId, paymentId })
      .expect(201);
    createdId = res.body.id;
  }, 30_000);

  afterAll(async () => {
    await prisma.referralTransaction.deleteMany({ where: { id: createdId } });
    await prisma.payment.deleteMany({
      where: { id: { in: [paymentId, ...extraPayments] } },
    });
    await prisma.user.deleteMany({
      where: { id: { in: [referrerId, referredId, ...extraUsers] } },
    });
    await app.close();
  });

  describe('POST /api/v1/referral-transactions', () => {
    it('creates a transaction', async () => {
      // @@unique([referrerId, referredId]) — нужна новая пара.
      const referred2 = await prisma.user.create({
        data: { username: `e2e-referred2-${Date.now()}` },
      });
      extraUsers.push(referred2.id);
      const p = await prisma.payment.create({
        data: { userId: referred2.id, amount: 500 },
      });
      extraPayments.push(p.id);

      const res = await request(app.getHttpServer())
        .post('/api/v1/referral-transactions')
        .set('Authorization', AUTH_HEADER)
        .send({ referrerId, referredId: referred2.id, paymentId: p.id })
        .expect(201);
      expect(res.body.referrerId).toBe(referrerId);
      expect(res.body.referredId).toBe(referred2.id);

      await prisma.referralTransaction.deleteMany({
        where: { id: res.body.id },
      });
    });

    it('rejects payload without referrerId (400)', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/referral-transactions')
        .set('Authorization', AUTH_HEADER)
        .send({ referredId, paymentId })
        .expect(400);
    });

    it('returns 401 without auth', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/referral-transactions')
        .send({ referrerId, referredId, paymentId })
        .expect(401);
    });
  });

  describe('GET /api/v1/referral-transactions', () => {
    it('returns paginated list', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/referral-transactions')
        .set('Authorization', AUTH_HEADER)
        .expect(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(typeof res.body.count).toBe('number');
    });

    it('returns 401 without auth', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/referral-transactions')
        .expect(401);
    });
  });

  describe('GET /api/v1/referral-transactions/:id', () => {
    it('returns transaction by id', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/referral-transactions/${createdId}`)
        .set('Authorization', AUTH_HEADER)
        .expect(200);
      expect(res.body.id).toBe(createdId);
    });
  });

  describe('PATCH /api/v1/referral-transactions/:id', () => {
    it('allows partial update (only paymentId)', async () => {
      const p = await prisma.payment.create({
        data: { userId: referredId, amount: 700 },
      });
      extraPayments.push(p.id);

      const res = await request(app.getHttpServer())
        .patch(`/api/v1/referral-transactions/${createdId}`)
        .set('Authorization', AUTH_HEADER)
        .send({ paymentId: p.id })
        .expect(200);
      expect(res.body.paymentId).toBe(p.id);
    });

    it('returns 401 without auth', async () => {
      await request(app.getHttpServer())
        .patch(`/api/v1/referral-transactions/${createdId}`)
        .send({ paymentId })
        .expect(401);
    });
  });

  describe('DELETE /api/v1/referral-transactions/:id', () => {
    it('deletes a transaction (and its payment)', async () => {
      const referred3 = await prisma.user.create({
        data: { username: `e2e-referred3-${Date.now()}` },
      });
      extraUsers.push(referred3.id);
      const p = await prisma.payment.create({
        data: { userId: referred3.id, amount: 900 },
      });

      const res = await request(app.getHttpServer())
        .post('/api/v1/referral-transactions')
        .set('Authorization', AUTH_HEADER)
        .send({ referrerId, referredId: referred3.id, paymentId: p.id })
        .expect(201);

      await request(app.getHttpServer())
        .delete(`/api/v1/referral-transactions/${res.body.id}`)
        .set('Authorization', AUTH_HEADER)
        .expect(200);
    });

    it('returns 401 without auth', async () => {
      await request(app.getHttpServer())
        .delete(`/api/v1/referral-transactions/${createdId}`)
        .expect(401);
    });
  });
});
