import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { log } from 'console';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AllExceptionsFilter } from './filters/exceptions.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const port = process.env.APP_PORT ? Number(process.env.APP_PORT) : 8080;
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port,
      },
    }
  );

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(new ValidationPipe());

  await app.listen().then(() => {
    log(`
     ============================================
     =  {{ template }} execution info:
     =  NAME: ${process.env.APP_NAME}
     =  PORT: ${port}
     ============================================
     `);
  });
}

bootstrap();
