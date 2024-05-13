import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import Session from 'express-session';
import createMemoryStore from 'memorystore';
const MemoryStore = createMemoryStore(Session);

import { AppModule } from './app.module';

const isProduction = process.env.NODE_ENV === 'production';
const cookieAge = 1000 * 60 * 60 * 24; // 24 hours

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  app.use(
    Session({
      name: 'chatbot.estimate.sid',
      secret: process.env.SECRET,
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: cookieAge,
        httpOnly: false,
        secure: isProduction,
      },
      store: new MemoryStore({ checkPeriod: cookieAge }),
    }),
  );

  await app.listen(process.env.PORT || 3001);
}
bootstrap();
