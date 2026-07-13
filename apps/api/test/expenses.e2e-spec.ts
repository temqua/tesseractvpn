import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { PrismaClient, ExpenseCategory } from '@prisma/client';
import { AppModule } from '../src/app.module';
import { DatabaseService } from '../src/database.service';
import {
  SEED_EXPENSES,
  SUM_NALOG,
  SUM_SERVERS,
  SUM_TOTAL,
  seedExpenses,
  cleanupByIds,
  cleanupByDescription,
} from './expenses-seed';

const AUTH_HEADER = `Bearer ${process.env.API_TOKEN ?? 'test-api-token'}`;

describe('Expenses (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaClient;
  let seededIds: string[];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('/api/v1');
    await app.init();

    const dbService = app.get(DatabaseService);
    prisma = dbService.client;

    await prisma.expense.deleteMany();
    const created = await seedExpenses(prisma);
    seededIds = created.map((e) => e.id);
  }, 30_000);

  afterAll(async () => {
    await prisma.expense.deleteMany();
    await app.close();
  });

  describe('GET /api/v1/expenses', () => {
    it('should return all seeded expenses', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/expenses')
        .set('Authorization', AUTH_HEADER)
        .expect(200);

      expect(res.body.data).toHaveLength(SEED_EXPENSES.length);
      expect(res.body.count).toBe(SEED_EXPENSES.length);
    });

    it('should filter by category Nalog', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/expenses?category=Nalog')
        .set('Authorization', AUTH_HEADER)
        .expect(200);

      expect(res.body.data).toHaveLength(2);
      expect(res.body.data.every((e: any) => e.category === 'Nalog')).toBe(
        true,
      );
    });

    it('should filter by category Servers', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/expenses?category=Servers')
        .set('Authorization', AUTH_HEADER)
        .expect(200);

      expect(res.body.data).toHaveLength(3);
      expect(res.body.data.every((e: any) => e.category === 'Servers')).toBe(
        true,
      );
    });

    it('should filter by date range', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/expenses?from=2025-01-01&to=2025-01-31')
        .set('Authorization', AUTH_HEADER)
        .expect(200);

      expect(res.body.data).toHaveLength(2);
      expect(
        res.body.data.every(
          (e: any) =>
            new Date(e.paymentDate) >= new Date('2025-01-01') &&
            new Date(e.paymentDate) <= new Date('2025-01-31T23:59:59'),
        ),
      ).toBe(true);
    });

    it('should paginate results', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/expenses?take=2&skip=0')
        .set('Authorization', AUTH_HEADER)
        .expect(200);

      expect(res.body.data).toHaveLength(2);
      expect(res.body.count).toBe(SEED_EXPENSES.length);
    });

    it('should paginate with skip', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/expenses?take=2&skip=2')
        .set('Authorization', AUTH_HEADER)
        .expect(200);

      expect(res.body.data).toHaveLength(2);
    });

    it('should return 401 without auth header', async () => {
      await request(app.getHttpServer()).get('/api/v1/expenses').expect(401);
    });
  });

  describe('GET /api/v1/expenses/:id', () => {
    it('should return a single expense by id', async () => {
      const id = seededIds[0];
      const res = await request(app.getHttpServer())
        .get(`/api/v1/expenses/${id}`)
        .set('Authorization', AUTH_HEADER)
        .expect(200);

      expect(res.body.id).toBe(id);
      expect(res.body.category).toBe(SEED_EXPENSES[0].category);
      expect(Number(res.body.amount)).toBe(SEED_EXPENSES[0].amount);
      expect(res.body.description).toBe(SEED_EXPENSES[0].description);
    });

    it('should return 404 for non-existent id', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/expenses/00000000-0000-0000-0000-000000000000')
        .set('Authorization', AUTH_HEADER)
        .expect(404);
    });
  });

  describe('GET /api/v1/expenses/sum', () => {
    it('should return total sum of all expenses', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/expenses/sum')
        .set('Authorization', AUTH_HEADER)
        .expect(200);

      expect(Number(res.body.amount)).toBe(SUM_TOTAL);
    });

    it('should return sum for Nalog category', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/expenses/sum?category=Nalog')
        .set('Authorization', AUTH_HEADER)
        .expect(200);

      expect(Number(res.body.amount)).toBe(SUM_NALOG);
    });

    it('should return sum for Servers category', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/expenses/sum?category=Servers')
        .set('Authorization', AUTH_HEADER)
        .expect(200);

      expect(Number(res.body.amount)).toBe(SUM_SERVERS);
    });
  });

  describe('POST /api/v1/expenses', () => {
    it('should create a new expense', async () => {
      const dto = {
        category: ExpenseCategory.Servers,
        amount: 9999,
        description: 'Test expense creation',
      };

      const res = await request(app.getHttpServer())
        .post('/api/v1/expenses')
        .set('Authorization', AUTH_HEADER)
        .send(dto)
        .expect(201);

      expect(res.body.id).toBeDefined();
      expect(res.body.category).toBe(dto.category);
      expect(Number(res.body.amount)).toBe(dto.amount);
      expect(res.body.description).toBe(dto.description);

      await cleanupByIds(prisma, [res.body.id]);
    });

    it('should return 401 without auth', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/expenses')
        .send({ category: 'Nalog', amount: 100, description: 'x' })
        .expect(401);
    });
  });

  describe('PATCH /api/v1/expenses/:id', () => {
    it('should update an existing expense', async () => {
      const createRes = await request(app.getHttpServer())
        .post('/api/v1/expenses')
        .set('Authorization', AUTH_HEADER)
        .send({
          category: ExpenseCategory.Nalog,
          amount: 1111,
          description: 'To be updated',
        })
        .expect(201);

      const id = createRes.body.id;

      const patchRes = await request(app.getHttpServer())
        .patch(`/api/v1/expenses/${id}`)
        .set('Authorization', AUTH_HEADER)
        .send({ amount: 2222, description: 'Updated description' })
        .expect(200);

      expect(Number(patchRes.body.amount)).toBe(2222);
      expect(patchRes.body.description).toBe('Updated description');
      expect(patchRes.body.category).toBe('Nalog');

      await cleanupByIds(prisma, [id]);
    });

    it('should return 401 without auth', async () => {
      await request(app.getHttpServer())
        .patch(`/api/v1/expenses/${seededIds[0]}`)
        .send({ amount: 1 })
        .expect(401);
    });
  });

  describe('DELETE /api/v1/expenses/:id', () => {
    it('should delete an expense', async () => {
      const createRes = await request(app.getHttpServer())
        .post('/api/v1/expenses')
        .set('Authorization', AUTH_HEADER)
        .send({
          category: ExpenseCategory.Servers,
          amount: 5555,
          description: 'To be deleted',
        })
        .expect(201);

      const id = createRes.body.id;

      await request(app.getHttpServer())
        .delete(`/api/v1/expenses/${id}`)
        .set('Authorization', AUTH_HEADER)
        .expect(200);

      await request(app.getHttpServer())
        .get(`/api/v1/expenses/${id}`)
        .set('Authorization', AUTH_HEADER)
        .expect(404);
    });

    it('should return 401 without auth', async () => {
      await request(app.getHttpServer())
        .delete(`/api/v1/expenses/${seededIds[0]}`)
        .expect(401);
    });
  });
});
