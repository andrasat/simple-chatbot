import React, { ChangeEvent } from 'react';
import { noto } from '@lib/fonts';
import clsx from 'clsx';

interface TextInputProps {
  name: string;
  defaultValue?: string;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  className?: string;
  disable?: boolean;
}

const TextInput: React.FC<TextInputProps> = ({
  name,
  defaultValue,
  onChange = () => {},
  onKeyDown = () => {},
  placeholder = '',
  className = '',
  disable = false,
}) => {
  return (
    <textarea
      cols={30}
      rows={2}
      name={name}
      value={defaultValue}
      onChange={onChange}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      disabled={disable}
      className={clsx(
        'text-gray-900',
        'font-light',
        'px-4',
        'py-2',
        'rounded-l-lg',
        'border',
        'border-gray-300',
        'focus:outline-none',
        'focus:ring-2',
        'focus:ring-blue-500',
        disable ? 'bg-gray-100' : 'bg-white',
        noto.className,
        className,
      )}
    />
  );
};

export default TextInput;
