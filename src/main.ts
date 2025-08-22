import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Configure Swagger with Authorization
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Your API Title')
    .setDescription('API Description')
    .setVersion('1.0')
    // Add Bearer Auth configuration
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT token',
      },
      'JWT-auth', // Security scheme name (used in @ApiBearerAuth)
    )
    // Optional: Apply globally to all routes
    .addSecurityRequirements('JWT-auth') // 👈 Optional global security requirement
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('swagger', app, document);
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });
  await app.listen(process.env.PORT ?? 8000);
  console.log('Conntected ...., Port: '+ process.env.PORT && 8000);
}
void bootstrap();
