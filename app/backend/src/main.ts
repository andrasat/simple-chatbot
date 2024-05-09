import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import * as Session from 'express-session';
import RedisStore from 'connect-redis';
import { createClient } from 'redis';

import { AppModule } from './app.module';

const isProduction = process.env.NODE_ENV === 'production';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  let redisStore: RedisStore | undefined;
  if (isProduction) {
    try {
      const RedisClient = createClient({ url: process.env.REDIS_URL });
      await RedisClient.connect();

      redisStore = new RedisStore({
        client: RedisClient,
        prefix: 'chatbot.estimate',
        ttl: 24 * 60 * 60, // 24 hours
      });
    } catch (error) {
      console.error(error);
    }
  }

  app.use(
    Session({
      name: 'chatbot.estimate.sid',
      secret: process.env.SECRET,
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
        httpOnly: false,
        secure: isProduction,
      },
      store: redisStore,
    }),
  );

  await app.listen(process.env.PORT || 3001);
}
bootstrap();
