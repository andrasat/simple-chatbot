'use client';
import { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import DOMPurify from 'dompurify';

import TextAreaInput from '@components/TextAreaInput';
import SubmitButton from '@components/SubmitButton';

import { noto } from '@lib/fonts';
import { getWelcomeMsgStream, chatAI } from '@lib/api';
import { Message } from '@lib/types';

type Props = {
  locale: string;
  dictionary: {
    text: { title: string; enter: string; you: string };
    error: { 'input-message-empty': string };
    placeholder: { 'input-message': string };
  };
};

function AIMessage({ aiMessage, name }: { aiMessage: string; name: string }) {
  const sanitizedInnerHTML = { __html: DOMPurify.sanitize(aiMessage) };
  return (
    <p className={clsx('flex', 'my-3', noto.className)}>
      <span className={clsx('font-semibold', 'flex-[0_0_40px]', 'pr-2')}>
        {name}:
      </span>
      <span
        className={clsx(
          'bg-slate-800',
          'font-light',
          'tracking-wide',
          'p-2',
          'rounded-md',
        )}
        dangerouslySetInnerHTML={sanitizedInnerHTML}
      ></span>
    </p>
  );
}

function UserMessage({
  userMessage,
  name,
}: {
  userMessage: string;
  name: string;
}) {
  const sanitizedInnerHTML = { __html: DOMPurify.sanitize(userMessage) };
  return (
    <p className={clsx('flex', 'my-2', noto.className)}>
      <span className={clsx('font-semibold', 'flex-[0_0_40px]', 'pr-2')}>
        {name}:
      </span>
      <span
        className="font-light"
        dangerouslySetInnerHTML={sanitizedInnerHTML}
      ></span>
    </p>
  );
}

function Chat({ locale, dictionary }: Props) {
  const [error, setError] = useState('');
  const [disableInput, setDisableInput] = useState(false);
  const [conversation, setConversation] = useState<Message[]>([]);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const conversationRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    async function fetchWelcomeMessage() {
      setDisableInput(true);
      const chunks = getWelcomeMsgStream(locale);

      for await (const chunk of chunks) {
        setConversation(([prevConversation]) => [
          {
            role: 'assistant',
            content: prevConversation
              ? prevConversation.content + chunk
              : chunk,
          },
        ]);
      }

      setDisableInput(false);
    }

    if (conversation.length === 0) {
      fetchWelcomeMessage();
    }
  }, [locale, conversation.length]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const isStart = conversation.length === 1;
    const prevAIMessage = isStart
      ? ''
      : conversation[conversation.length - 1]?.content;

    const formData = new FormData(e.currentTarget);
    const userMessage = formData.get('userMessage') as string;

    if (!userMessage) {
      setError(dictionary.error['input-message-empty']);
      return;
    }

    setConversation((prevConversation) => [
      ...prevConversation,
      {
        role: 'user',
        content: userMessage,
      },
    ]);

    textAreaRef.current!.value = '';

    const chunks = chatAI({ userMessage, prevAIMessage }, locale);
    setDisableInput(true);

    let newMessage = '';
    for await (const chunk of chunks) {
      newMessage += chunk;
      setConversation((prevConversation) => {
        const lastMessage = prevConversation[prevConversation.length - 1];

        if (lastMessage.role === 'user') {
          return prevConversation.concat({ role: 'assistant', content: chunk });
        } else {
          return prevConversation.slice(0, -1).concat({
            role: 'assistant',
            content: newMessage,
          });
        }
      });

      const containerEl = conversationRef.current;
      if (containerEl) {
        containerEl.scrollTo(0, containerEl.scrollHeight);
      }
    }

    setDisableInput(false);
  }

  const inputOnKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      buttonRef.current?.click();
    }
  };

  return (
    <div
      className={clsx(
        'flex',
        'flex-col',
        'py-10',
        'px-4',
        'w-full',
        'h-screen',
      )}
    >
      <div
        ref={conversationRef}
        className={clsx('flex-auto', 'overflow-y-auto', 'mb-4', 'px-2')}
      >
        {conversation.map((msg, index) => {
          switch (msg.role) {
            case 'assistant':
              return (
                <AIMessage key={index} aiMessage={msg.content} name="AI" />
              );
            case 'user':
              return (
                <UserMessage
                  key={index}
                  userMessage={msg.content}
                  name={dictionary.text['you']}
                />
              );
          }
        })}
      </div>
      <form onSubmit={handleSubmit} className={clsx('flex', 'flex-shrink')}>
        <TextAreaInput
          ref={textAreaRef}
          name="userMessage"
          placeholder={dictionary.placeholder['input-message']}
          disable={disableInput}
          className={clsx('flex-auto')}
          onKeyDown={inputOnKeyDown}
        />
        <SubmitButton
          id="submit-button"
          type="submit"
          ref={buttonRef}
          className={clsx('flex-initial')}
        >
          {dictionary.text['enter']}
        </SubmitButton>
      </form>
      {error && (
        <div className={clsx('text-red-500', 'text-sm', 'py-2')}>{error}</div>
      )}
    </div>
  );
}

export default Chat;
