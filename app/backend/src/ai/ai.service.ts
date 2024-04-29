import { Injectable, Logger } from '@nestjs/common';
import { ChatAnthropic } from '@langchain/anthropic';
import { InMemoryChatMessageHistory } from '@langchain/core/chat_history';
import { RunnableWithMessageHistory } from '@langchain/core/runnables';
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from '@langchain/core/prompts';
import {
  HumanMessage,
  SystemMessage,
  AIMessage,
} from '@langchain/core/messages';

import {
  WELCOME_SYSTEM_MESSAGE,
  REQUIREMENT_GENERATOR_SYSTEM_PROMPT,
} from '../utils/systemPrompts';
import { CHAT_HISTORY } from '../utils/constants';
import { CommonMessage, ROLE } from './ai.types';

@Injectable()
export class AiService {
  private readonly haiku: ChatAnthropic;
  private readonly sonnet: ChatAnthropic;
  private histories: Record<string, InMemoryChatMessageHistory>;

  constructor() {
    this.haiku = new ChatAnthropic({
      model: 'claude-3-haiku-20240307',
      maxConcurrency: 5,
      streaming: true,
      temperature: 0.9,
    });
    this.sonnet = new ChatAnthropic({
      model: 'claude-3-sonnet-20240229',
      maxConcurrency: 3,
      streaming: true,
      temperature: 0,
    });
    this.histories = {};
  }

  private readonly logger = new Logger('AiService');

  private _formatMessages = async (messages: CommonMessage[]) => {
    const templates = messages.map((msg) =>
      ChatPromptTemplate.fromTemplate(msg.message),
    );

    const formattedMessages = await Promise.all(
      messages.map(async (msg, idx) => {
        const formattedMessage = await templates[idx].format(msg.args);

        switch (msg.role) {
          case ROLE.USER:
            return new HumanMessage(formattedMessage);
          case ROLE.ASSISTANT:
            return new AIMessage(formattedMessage);
          case ROLE.SYSTEM:
            return new SystemMessage(formattedMessage);
        }
      }),
    );

    return formattedMessages;
  };

  private _initiateChat = async (
    chatModel: ChatAnthropic,
    initialMessages: CommonMessage[],
    sessionId: string,
  ) => {
    const formattedMessages = await this._formatMessages(initialMessages);

    const prompt = ChatPromptTemplate.fromMessages(formattedMessages);
    const chain = prompt.pipe(chatModel);

    return chain.stream({}, { configurable: { sessionId } });
  };

  private _chat = async (
    chatModel: ChatAnthropic,
    newMessage: string,
    sessionId: string,
    aiAnswer?: string,
  ) => {
    const prompts = ChatPromptTemplate.fromMessages([
      new MessagesPlaceholder(CHAT_HISTORY),
      ['human', '{input}'],
    ]);
    let history: InMemoryChatMessageHistory;

    if (this.histories[sessionId]) {
      history = this.histories[sessionId];

      if (aiAnswer) await history.addAIMessage(aiAnswer);
    } else {
      history = new InMemoryChatMessageHistory([
        new SystemMessage(REQUIREMENT_GENERATOR_SYSTEM_PROMPT),
      ]);
    }

    const chain = prompts.pipe(chatModel);
    const chainWithHistory = new RunnableWithMessageHistory({
      runnable: chain,
      getMessageHistory: () => history,
      inputMessagesKey: 'input',
      historyMessagesKey: CHAT_HISTORY,
    });

    return chainWithHistory.stream(
      { input: newMessage },
      { configurable: { sessionId } },
    );
  };

  initiate = (language: string = 'en-US', sessionId: string) => {
    return this._initiateChat(
      this.haiku,
      [
        {
          role: ROLE.SYSTEM,
          message: WELCOME_SYSTEM_MESSAGE,
          args: { language },
        },
        {
          role: ROLE.USER,
          message: 'Please generate a welcome message.',
          args: {},
        },
      ],
      sessionId,
    );
  };

  chatHaiku = (message: string, sessionId: string, aiAnswer?: string) => {
    return this._chat(this.haiku, message, sessionId, aiAnswer);
  };

  chatSonnet = (message: string, sessionId: string, aiAnswer?: string) => {
    return this._chat(this.sonnet, message, sessionId, aiAnswer);
  };
}
