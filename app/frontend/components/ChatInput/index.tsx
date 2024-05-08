import React, { useState, forwardRef } from 'react';
import DOMPurify from 'dompurify';
import clsx from 'clsx';
import { noto } from '@lib/fonts';

import styles from './style.module.scss';

type ChatInputProps = {
  name: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLSpanElement>) => void;
  onEnter?: (e: React.KeyboardEvent<HTMLSpanElement>) => void;
  placeholder?: string;
  className?: string;
  disable?: boolean;
};

const ChatInput = forwardRef<HTMLInputElement, ChatInputProps>(
  (
    {
      name,
      defaultValue = '',
      onChange = () => {},
      onKeyDown = () => {},
      onEnter = () => {},
      placeholder = '',
      className = '',
      disable = false,
    },
    ref,
  ) => {
    const [value, setValue] = useState(defaultValue);
    const [isComposing, setIsComposing] = useState(false);

    const _onChange = (e: React.FormEvent<HTMLSpanElement>) => {
      if (typeof e.currentTarget.textContent === 'string') {
        const sanitizedValue = DOMPurify.sanitize(e.currentTarget.innerHTML);

        setValue(sanitizedValue);

        if (typeof onChange === 'function') onChange(sanitizedValue);
      }
    };

    const _onKeydown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
      if (isComposing) return;

      if (typeof onKeyDown === 'function') onKeyDown(e);
      if (e.key === 'Enter') {
        setValue('');
        e.currentTarget.innerHTML = '';

        if (typeof onEnter === 'function') onEnter(e);
      }
    };

    return (
      <label htmlFor="chat-input">
        <input
          id="chat-input"
          type="hidden"
          name={name}
          value={value}
          disabled={disable}
          ref={ref}
        />
        <span
          contentEditable={disable ? 'false' : 'true'}
          onInput={_onChange}
          onKeyDown={_onKeydown}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          data-placeholder={placeholder}
          tabIndex={0}
          className={clsx(
            'inline-block',
            'text-gray-300',
            'break-all',
            'text-sm',
            'focus:outline-none',
            disable ? 'cursor-not-allowed' : 'cursor-text',
            noto.className,
            styles.chatInputContent,
            className,
          )}
        ></span>
      </label>
    );
  },
);

ChatInput.displayName = 'ChatInput';

export default ChatInput;
