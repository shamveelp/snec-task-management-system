import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { winstonConfig } from './config/logger.config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: winstonConfig,
  });
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
