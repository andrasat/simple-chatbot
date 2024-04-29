import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Res,
  Session,
} from '@nestjs/common';
import { AiService } from './ai/ai.service';

import type { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly aiService: AiService) {}

  @Get('/health')
  checkHealth(): string {
    return 'OK';
  }

  @Get('/ai/welcome')
  async getWelcome(
    @Headers('accept-language') language: string,
    @Session() session: Record<string, any>,
    @Res() res: Response,
  ) {
    const stream = await this.aiService.initiate(language, session.id);

    for await (const chunk of stream) {
      res.write(chunk.content);
    }

    res.end();
  }

  @Post('/ai/haiku')
  async getHaiku(
    @Body('message') message: string,
    @Session() session: Record<string, any>,
    @Res() res: Response,
    @Body('prevAIAnswer') aiAnswer?: string,
  ) {
    const stream = await this.aiService.chatHaiku(
      message,
      session.id,
      aiAnswer,
    );

    for await (const chunk of stream) {
      res.write(chunk.content);
    }

    res.end();
  }

  @Post('/ai/sonnet')
  async getSonnet(
    @Body('message') message: string,
    @Session() session: Record<string, any>,
    @Res() res: Response,
    @Body('prevAIAnswer') aiAnswer?: string,
  ) {
    const stream = await this.aiService.chatSonnet(
      message,
      session.id,
      aiAnswer,
    );

    for await (const chunk of stream) {
      res.write(chunk.content);
    }

    res.end();
  }
}
