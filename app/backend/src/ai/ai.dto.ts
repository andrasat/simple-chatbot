import { IsNotEmpty, IsString } from 'class-validator';

export class InputData {
  @IsNotEmpty()
  @IsString()
  userMessage: string;

  @IsString()
  prevAIMessage?: string;

  @IsString()
  language?: string;
}
