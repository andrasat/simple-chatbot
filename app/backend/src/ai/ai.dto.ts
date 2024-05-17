import { IsNotEmpty, IsString } from 'class-validator';

export class ChatInput {
  @IsNotEmpty()
  @IsString()
  readonly userMessage: string;
}
