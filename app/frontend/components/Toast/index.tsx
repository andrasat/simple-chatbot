'use client';
import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';

type ToastProps = {
  type: 'success' | 'warn' | 'error' | 'info';
  message: string;
};

const Toast: React.FC<ToastProps> = ({ type, message }) => {
  const container = useRef<HTMLElement>();

  useEffect(() => {
    const portalEl = document.getElementById('toast-portal');
    if (portalEl) container.current = portalEl;

    let timer: ReturnType<typeof setTimeout> | null = null;

    if (container.current) {
      timer = setTimeout(() => {
        if (container.current) {
          container.current = undefined;
        }
      }, 2000);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
      if (container.current) {
        container.current = undefined;
      }
    };
  }, []);

  let backgroundColor, textColor;
  switch (type) {
    case 'success':
      backgroundColor = 'bg-green-500';
      textColor = 'text-white';
      break;
    case 'warn':
      backgroundColor = 'bg-yellow-500';
      textColor = 'text-white';
      break;
    case 'error':
      backgroundColor = 'bg-red-500';
      textColor = 'text-white';
      break;
    case 'info':
      backgroundColor = 'bg-blue-500';
      textColor = 'text-white';
      break;
    default:
      backgroundColor = 'bg-gray-500';
      textColor = 'text-white';
  }

  return container.current
    ? createPortal(
        <div
          className={clsx(
            'px-4',
            'py-2',
            'rounded-md',
            'shadow-md',
            backgroundColor,
            textColor,
            'w-[150px]',
            'text-center',
          )}
        >
          {message}
        </div>,
        container.current,
      )
    : null;
};

export default Toast;
