import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import 'dotenv/config';

const port = process.env.PORT || 4000;

const messageOnServerStart = `\x1b[33mThe Server was started at http://localhost:${port} \x1b[0m`;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  await app.listen(port, () => console.log(messageOnServerStart));
}
bootstrap();
