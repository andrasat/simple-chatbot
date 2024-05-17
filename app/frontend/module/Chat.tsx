'use client';
import { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';

import ChatInput from '@components/ChatInput';
import FileUploadButton from '@components/FileUploadButton';
import SubmitButton from '@components/SubmitButton';
import MessageBlock from '@components/MessageBlock';

import { getWelcomeMsgStream, chatAI } from '@lib/api';
import pdfToText from '@lib/pdfToText';
import { Message } from '@lib/types';

type ChatProps = {
  locale: string;
  dictionary: {
    text: { title: string; enter: string; user: string; assistant: string };
    error: { 'input-message-empty': string; 'file-type-pdf': string };
    placeholder: { 'input-message': string };
  };
};

function Chat({ locale, dictionary }: ChatProps) {
  const [error, setError] = useState('');
  const [filename, setFilename] = useState('');
  const [disableInput, setDisableInput] = useState(false);
  const [conversation, setConversation] = useState<Message[]>([]);

  const didInit = useRef(false);
  const documentText = useRef('');
  const buttonRef = useRef<HTMLButtonElement>(null);
  const conversationRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

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

    if (!didInit.current) {
      didInit.current = true;
      fetchWelcomeMessage();
    }
  }, [locale]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const userMessage = formData.get('userMessage') as string;

    if (!userMessage) {
      setError(dictionary.error['input-message-empty']);
      return;
    } else {
      setError('');
    }

    const userMessageForDisplay =
      userMessage + (filename ? `\nFile: (${filename})` : '');
    const userMessageForAPI =
      userMessage +
      (documentText.current
        ? `\n<document>\n${documentText.current}\n</document>`
        : '');

    setConversation((prevConversation) => [
      ...prevConversation,
      {
        role: 'user',
        content: userMessageForDisplay,
      },
    ]);

    setFilename('');
    documentText.current = '';

    const chunks = chatAI(
      { userMessage: userMessageForAPI },
      locale,
    );
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

  const handleInputOnChange = (value: string) => {
    if (value) {
      setError('');
    }
  };

  const handleFileUpload = async (file: File) => {
    if (file.type !== 'application/pdf') {
      setError(dictionary.error['file-type-pdf']);
      return;
    } else {
      setError('');
    }

    const data = await file.arrayBuffer();
    const text = await pdfToText(data);
    setFilename(file.name);
    documentText.current = text;
  };

  const handleEnterKey = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    e.preventDefault();
    buttonRef.current?.click();
  };

  const removeCurrentDocument = () => {
    setError('');
    setFilename('');
    chatInputRef.current!.value = '';
    chatInputRef.current!.nextSibling!.textContent = '';
    documentText.current = '';
  };

  return (
    <div
      className={clsx(
        'flex',
        'flex-col',
        'pt-10',
        'pb-3',
        'px-4',
        'w-full',
        'h-screen',
      )}
    >
      <div
        ref={conversationRef}
        className={clsx(
          'flex',
          'flex-col',
          'flex-auto',
          'overflow-y-auto',
          'mb-4',
          'px-2',
        )}
      >
        {conversation.map((msg, index) => (
          <MessageBlock
            key={index}
            message={msg}
            name={dictionary.text[msg.role]}
          />
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <div className={clsx('flex', 'min-h-[60px]')}>
          <div
            className={clsx(
              'flex-auto',
              'border',
              'border-r-0',
              'border-gray-900',
              'rounded-l-lg',
            )}
          >
            <ChatInput
              ref={chatInputRef}
              name="userMessage"
              placeholder={dictionary.placeholder['input-message']}
              disable={disableInput}
              onChange={handleInputOnChange}
              onEnter={handleEnterKey}
              className={clsx('w-full', 'h-[20px]', 'mt-2', 'ml-3')}
            />
            <div className={clsx('flex', 'items-center', 'px-2', 'py-1')}>
              <FileUploadButton
                onFileUpload={handleFileUpload}
                className={clsx(
                  'inline-flex',
                  'flex-col',
                  'items-center',
                  'justify-center',
                  'min-w-[20px]',
                  'min-h-[30px]',
                  'mr-2',
                )}
              />
              <span className="text-xs font-light">
                {filename ? (
                  <>
                    {filename}
                    &nbsp;
                    <span
                      className="cursor-pointer"
                      onClick={removeCurrentDocument}
                    >
                      <i className="fa-light fa-xmark text-sm"></i>
                    </span>
                  </>
                ) : (
                  ''
                )}
              </span>
            </div>
          </div>
          <SubmitButton
            id="submit-button"
            type="submit"
            ref={buttonRef}
            className={clsx(
              'flex-[0_1_50px]',
              'border-l-0',
              'border-r-[1px]',
              'border-t-[1px]',
              'border-b-[1px]',
              'border-gray-900',
              'rounded-r-lg',
            )}
          >
            <i className="fa-solid fa-paper-plane"></i>
          </SubmitButton>
        </div>
      </form>
      <div
        className={clsx('text-red-500', 'text-sm', 'px-3', 'pt-1', 'h-[24px]')}
      >
        {error}
      </div>
    </div>
  );
}

export default Chat;
