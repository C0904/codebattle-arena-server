import { NestFactory } from '@nestjs/core';
import { AppModule } from '@app/app.module';
import { ConfigService } from '@nestjs/config';
import { ResponseExceptionFilter } from '@app/common/filter/response.filter';
import { ResponseInterceptor } from '@app/common/interceptor/response.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from '@app/config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // get ENV data
  const config = app.get(ConfigService);

  // client Domain OR Host AND allow Http Method
  app.enableCors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE'],
    credentials: true, // accept Cookies OR Authorization Header
  });

  // use graceful shutdown
  app.enableShutdownHooks();

  app.useGlobalFilters(new ResponseExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  setupSwagger(app);

  await app.listen(config.get('APP_PORT'));
}

bootstrap();
