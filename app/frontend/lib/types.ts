export type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export type ChatInput = {
  userMessage: string;
  prevAIMessage?: string;
};