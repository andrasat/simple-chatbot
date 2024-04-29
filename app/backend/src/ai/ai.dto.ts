import { IsNotEmpty, IsString } from 'class-validator';

export class ChatInput {
  @IsNotEmpty()
  @IsString()
  userMessage: string;

  @IsString()
  prevAIMessage?: string;

  @IsString()
  language?: string;
}
