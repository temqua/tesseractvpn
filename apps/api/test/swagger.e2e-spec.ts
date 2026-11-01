import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { App } from 'supertest/types';
import { createTestApp } from './helpers';

interface SchemaLike {
  required?: string[];
  properties?: Record<string, SchemaLike>;
  enum?: unknown[];
  type?: string;
  items?: SchemaLike;
}

/**
 * Тест на генерацию OpenAPI-документа. Это прямой тест изменений, внесённых
 * в DTO/сущности/контроллеры: если какой-то декоратор @ApiProperty/@ApiOkResponse
 * задан неверно (циклическая ссылка, кривой enum, битая ссылка на тип) —
 * createDocument упадёт или схема окажется пустой.
 */
describe('Swagger document (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    ({ app } = await createTestApp());
  }, 30_000);

  afterAll(async () => {
    await app.close();
  });

  function buildDoc() {
    const config = new DocumentBuilder()
      .setTitle('Tesseract API')
      .setDescription('The Tesseract API description')
      .setVersion('1.0')
      .addBearerAuth()
      .addServer('/api/v1')
      .build();
    return SwaggerModule.createDocument(app, config) as {
      info: { title: string };
      paths: Record<string, unknown>;
      components?: {
        securitySchemes?: Record<string, unknown>;
        schemas?: Record<string, SchemaLike>;
      };
    };
  }

  function getSchema(doc: ReturnType<typeof buildDoc>, name: string) {
    return doc.components?.schemas?.[name];
  }

  it('should generate a document with info and paths', () => {
    const doc = buildDoc();

    expect(doc.info.title).toBe('Tesseract API');
    expect(doc.components?.securitySchemes?.bearer).toBeDefined();
    expect(Object.keys(doc.paths).length).toBeGreaterThan(0);
  });

  it('should register response entity schemas for every model', () => {
    const doc = buildDoc();

    const expected = [
      'User',
      'Payment',
      'Expense',
      'Plan',
      'Server',
      'UsersServers',
      'MessageDelivery',
      'UserAction',
      'ReferralTransaction',
      'BotIncomingMessage',
      'BotUnauthorizedUserAction',
      'BotUnauthorizedDeliveredMessage',
    ];

    for (const name of expected) {
      expect(getSchema(doc, name)).toBeDefined();
    }
  });

  it('should describe CreateUserDto with required username', () => {
    const doc = buildDoc();
    const schema = getSchema(doc, 'CreateUserDto');

    expect(schema).toBeDefined();
    expect(schema?.required).toContain('username');
    // `devices` — массив (isArray), поэтому enum вложен в items:
    const devices = schema?.properties?.devices;
    expect(devices?.type).toBe('array');
    expect(devices?.items?.enum ?? devices?.enum).toEqual(
      expect.arrayContaining(['Android', 'iOS']),
    );
  });

  it('should make every Update* DTO fully optional via PartialType', () => {
    const doc = buildDoc();

    const updateDtos = [
      'UpdateUserDto',
      'UpdatePaymentDto',
      'UpdateExpenseDto',
      'UpdatePlanDto',
      'UpdateServerDto',
      'UpdateReferralTransactionDto',
      'UpdateBotIncomingMessageDto',
      'UpdateBotUnauthorizedDeliveredMessageDto',
      'UpdateBotUnauthorizedUserActionDto',
      'UpdateDeliveredMessageDto',
      'UpdateUsersActionDto',
    ];

    for (const name of updateDtos) {
      const schema = getSchema(doc, name);
      expect(schema).toBeDefined();
      // PartialType должен сделать все поля необязательными:
      expect(schema?.required ?? []).toEqual([]);
    }
  });

  it('should inline Prisma enums into entity schemas', () => {
    const doc = buildDoc();

    expect(getSchema(doc, 'User')?.properties?.role?.enum).toEqual(
      expect.arrayContaining(['CLIENT', 'ADMIN']),
    );
    expect(getSchema(doc, 'Payment')?.properties?.status?.enum).toEqual(
      expect.arrayContaining(['SUCCEEDED', 'CANCELLED', 'PENDING']),
    );
    expect(getSchema(doc, 'Expense')?.properties?.category?.enum).toEqual(
      expect.arrayContaining(['Nalog', 'Servers']),
    );
  });
});
