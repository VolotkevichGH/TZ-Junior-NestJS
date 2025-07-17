import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common'
import configuration from './config/configuration'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableVersioning({
    prefix: 'api/v',
    defaultVersion: '1',
    type: VersioningType.URI,
  });

  const config = new DocumentBuilder()
      .setTitle('Users')
      .setDescription('Users API')
      .setVersion('1.0')
      .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document)
  await app.listen(configuration().app.port ?? 4000);
}
bootstrap();
