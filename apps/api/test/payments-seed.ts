import { PrismaClient } from '@prisma/client';

export const SEED_USER = {
  username: 'test-payment-user',
  firstName: 'Test',
  lastName: 'PaymentUser',
  price: 150,
  free: false,
  active: true,
  currency: 'RUB',
};

export const SEED_PAYMENTS = [
  {
    userId: 0,
    amount: 1500,
    monthsCount: 1,
    expiresOn: new Date('2025-03-01T00:00:00.000Z'),
  },
  {
    userId: 0,
    amount: 3000,
    monthsCount: 3,
    expiresOn: new Date('2025-06-01T00:00:00.000Z'),
  },
  {
    userId: 0,
    amount: 4500,
    monthsCount: 6,
    expiresOn: new Date('2025-12-01T00:00:00.000Z'),
  },
  {
    userId: 0,
    amount: 2000,
    monthsCount: 2,
    expiresOn: new Date('2025-05-01T00:00:00.000Z'),
  },
  {
    userId: 0,
    amount: 5000,
    monthsCount: 12,
    expiresOn: new Date('2026-07-01T00:00:00.000Z'),
  },
];

export const SUM_TOTAL = SEED_PAYMENTS.reduce((sum, p) => sum + p.amount, 0);

export async function seedUser(prisma: PrismaClient) {
  const user = await prisma.user.create({ data: SEED_USER });
  return user;
}

export async function seedPayments(prisma: PrismaClient, userId: number) {
  const created = [];
  for (const payment of SEED_PAYMENTS) {
    const result = await prisma.payment.create({
      data: { ...payment, userId },
    });
    created.push(result);
  }
  return created;
}

export async function cleanupByIds(prisma: PrismaClient, ids: string[]) {
  if (ids.length === 0) return;
  await prisma.payment.deleteMany({ where: { id: { in: ids } } });
}

export async function cleanupUser(prisma: PrismaClient, userId: number) {
  await prisma.payment.deleteMany({ where: { userId } });
  await prisma.user.deleteMany({ where: { id: userId } });
}
