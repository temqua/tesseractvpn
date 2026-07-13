import { PrismaClient, ExpenseCategory } from '@prisma/client';

export const SEED_EXPENSES = [
  {
    category: ExpenseCategory.Nalog as const,
    amount: 5000,
    description: 'Tax payment Q1',
    paymentDate: new Date('2025-01-15T00:00:00.000Z'),
  },
  {
    category: ExpenseCategory.Nalog as const,
    amount: 3000,
    description: 'Tax payment Q2',
    paymentDate: new Date('2025-04-20T00:00:00.000Z'),
  },
  {
    category: ExpenseCategory.Servers as const,
    amount: 15000,
    description: 'Server hosting January',
    paymentDate: new Date('2025-01-10T00:00:00.000Z'),
  },
  {
    category: ExpenseCategory.Servers as const,
    amount: 8000,
    description: 'Server maintenance',
    paymentDate: new Date('2025-06-05T00:00:00.000Z'),
  },
  {
    category: ExpenseCategory.Servers as const,
    amount: 12000,
    description: 'Cloud storage',
    paymentDate: new Date('2025-07-01T00:00:00.000Z'),
  },
];

export const SUM_NALOG = 8000;
export const SUM_SERVERS = 35000;
export const SUM_TOTAL = 43000;

export async function seedExpenses(prisma: PrismaClient) {
  const created = [];
  for (const expense of SEED_EXPENSES) {
    const result = await prisma.expense.create({ data: expense });
    created.push(result);
  }
  return created;
}

export async function cleanupByIds(prisma: PrismaClient, ids: string[]) {
  if (ids.length === 0) return;
  await prisma.expense.deleteMany({ where: { id: { in: ids } } });
}

export async function cleanupByDescription(
  prisma: PrismaClient,
  description: string,
) {
  await prisma.expense.deleteMany({ where: { description } });
}
