import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Res,
  Session,
} from '@nestjs/common';
import { AiService } from './ai.service';
import { ChatInput } from './ai.dto';

import type { Response } from 'express';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get('/welcome')
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

  @Post('/haiku')
  async getHaiku(
    @Body('input') input: ChatInput,
    @Session() session: Record<string, any>,
    @Res() res: Response,
  ) {
    const stream = await this.aiService.chatHaiku(input, session.id);

    for await (const chunk of stream) {
      res.write(chunk.content);
    }

    res.end();
  }

  @Post('/sonnet')
  async getSonnet(
    @Body('input') input: ChatInput,
    @Session() session: Record<string, any>,
    @Res() res: Response,
  ) {
    const stream = await this.aiService.chatSonnet(input, session.id);

    for await (const chunk of stream) {
      res.write(chunk.content);
    }

    res.end();
  }
}
