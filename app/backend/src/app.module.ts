import { Module } from '@nestjs/common';
import { AiModule } from './ai/ai.module';
import { AppController } from './app.controller';

@Module({
  imports: [AiModule],
  controllers: [AppController],
})
export class AppModule {}
