import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import 'dotenv/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const port = process.env.PORT || 4000;

console.log(`The connection URL is ${process.env.DATABASE_URL}`);

const messageOnServerStart = `\x1b[33mThe Server was started at http://localhost:${port} \x1b[0m`;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Home library')
    .setDescription('Rest API for home library')
    .setVersion('0.0.1')
    .addTag('home_library')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(port, () => console.log(messageOnServerStart));
}
bootstrap();
