import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export const setupSwagger = (app: INestApplication): void => {
  const options = new DocumentBuilder()
    .setTitle(`${process.env.NODE_ENV} API Docs`)
    .setDescription(`${process.env.NODE_ENV} API Docs Documentation`)
    .setVersion('0.0.1')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        name: 'JWT',
        in: 'header',
      },
      'authorization',
    )
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs/api', app, document);
};
