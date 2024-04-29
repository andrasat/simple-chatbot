import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import * as Session from 'express-session';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  app.use(
    Session({
      name: 'estimate.sid',
      secret: 'secret',
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: 60000, // 10 minutes
        httpOnly: true,
        secure: false,
      },
    }),
  );

  await app.listen(3001);
}
bootstrap();
