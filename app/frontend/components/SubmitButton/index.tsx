import React from 'react';
import { noto } from '@lib/fonts';
import clsx from 'clsx';

interface SubmitButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  id?: string;
  type?: 'button' | 'submit' | 'reset' | undefined;
  className?: string;
}

const SubmitButton = React.forwardRef<HTMLButtonElement, SubmitButtonProps>(
  ({ children, onClick, id, type, className }, ref) => {
    return (
      <button
        id={id}
        type={type}
        onClick={onClick}
        ref={ref}
        className={clsx(
          'bg-blue-500',
          'hover:bg-blue-600',
          'text-white',
          'px-4',
          'py-2',
          'rounded-r-lg',
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
