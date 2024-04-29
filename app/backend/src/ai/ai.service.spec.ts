import { Test, TestingModule } from '@nestjs/testing';
import { AiService } from './ai.service';
import { CommonMessage, ROLE } from './ai.types';

describe('AiService', () => {
  let service: AiService;
  const _testMessage: CommonMessage = {
    role: ROLE.USER,
    message: 'hello world',
    args: {},
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AiService],
    }).compile();

    service = module.get<AiService>(AiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('_generatePrompt should return a formatted prompt string', async () => {
    const messages = await service['_formatMessages']([_testMessage]);
    expect(messages).toBeDefined();

    expect(messages[0].content).toBe('Human: hello world');
  });

  it('Haiku stream should be defined', async () => {
    const haiku = await service.chatHaiku(_testMessage.message, '1');
    expect(haiku).toBeDefined();
  });

  it('Sonnet stream should be defined', async () => {
    const sonnet = await service.chatSonnet(_testMessage.message, '2');
    expect(sonnet).toBeDefined();
  });
});
