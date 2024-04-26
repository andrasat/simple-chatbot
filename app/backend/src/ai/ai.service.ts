import { Injectable } from '@nestjs/common';
import { HuggingFaceInference } from 'langchain/llms/hf';

@Injectable()
export class AiService {
  private readonly llm: HuggingFaceInference;

  constructor() {
    this.llm = new HuggingFaceInference({
      model: '',
    });
  }
}
