import React from 'react';
import { noto } from '@lib/fonts';
import clsx from 'clsx';

type SubmitButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  id?: string;
  type?: 'button' | 'submit' | 'reset' | undefined;
  className?: string;
};

const SubmitButton = React.forwardRef<HTMLButtonElement, SubmitButtonProps>(
  ({ children, onClick, id, type, className }, ref) => {
    return (
      <button
        id={id}
        type={type}
        onClick={onClick}
        ref={ref}
        className={clsx(
          'bg-black',
          'hover:bg-gray-900',
          'text-gray-300',
          'text-sm',
          noto.className,
          className,
        )}
      >
        {children}
      </button>
    );
  },
);

SubmitButton.displayName = 'SubmitButton';

export default SubmitButton;
