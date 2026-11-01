import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { DatabaseService } from '../src/database.service';

export const AUTH_HEADER = `Bearer ${process.env.API_TOKEN ?? 'test-api-token'}`;

export interface TestContext {
  app: INestApplication<App>;
  prisma: Prisma;
}

export type Prisma = DatabaseService['client'];

/**
 * Поднимает полный AppModule (как в боевом приложении) с глобальным префиксом
 * и возвращает готовый HTTP-сервер + Prisma-клиент для сидинга/очистки.
 */
export async function createTestApp(): Promise<TestContext> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  app.setGlobalPrefix('/api/v1');
  // Повторяем глобальную настройку из main.ts, чтобы тесты проверяли реальное поведение.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: false },
    }),
  );
  await app.init();

  const dbService = app.get(DatabaseService);
  const prisma = dbService.client;

  return { app, prisma };
}
