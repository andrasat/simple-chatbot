'use client';
import DOMPurify from 'dompurify';
import clsx from 'clsx';

import { noto } from '@lib/fonts';
import { Message } from '@lib/types';

type MessageBlockProps = {
  message: Message;
  name: string;
};

function MessageBlock({ message, name }: MessageBlockProps) {
  const sanitizedInnerHTML = { __html: DOMPurify.sanitize(message.content) };
  switch (message.role) {
    case 'user':
      return (
        <p className={clsx('flex', 'self-end', 'my-4', noto.className)}>
          <span
            className={clsx(
              'bg-slate-500',
              'font-light',
              'tracking-wide',
              'p-2',
              'rounded-md',
            )}
            dangerouslySetInnerHTML={sanitizedInnerHTML}
          ></span>
          <span
            className={clsx(
              'font-semibold',
              'flex-[0_0_auto]',
              'pl-2',
              'text-right',
            )}
          >
            {name}
          </span>
        </p>
      );
    case 'assistant':
      return (
        <p className={clsx('flex', 'my-4', noto.className)}>
          <span className={clsx('font-semibold', 'flex-[0_0_30px]', 'pr-2')}>
            {name}
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
}

export default MessageBlock;
