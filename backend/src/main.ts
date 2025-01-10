import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionFilter } from './AllExceptionFilter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe()); // for validation of inputs
  app.enableCors({
    origin: process.env.CLIENT_BASE_URL,
    credentials: true
  })

  app.useGlobalFilters(new AllExceptionFilter())

  await app.listen(5000);
}
bootstrap();
