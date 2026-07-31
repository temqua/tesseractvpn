import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import env from './env';
import { RequestsInterceptor } from './logging-interceptor';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const allowed = env.CORS_ALLOWED_ORIGINS;
  app.enableCors({
    origin: env.APP_ENV === 'local' ? 'http://localhost:3000' : allowed,
  });
  const config = new DocumentBuilder()
    .setTitle('Tesseract')
    .setDescription('The Tesseract API description')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.setGlobalPrefix('/api/v1');
  app.useGlobalInterceptors(new RequestsInterceptor());
  await app.listen(env.PORT ?? 3002);
}
bootstrap();
