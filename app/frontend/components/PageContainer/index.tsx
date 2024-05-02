import React from 'react';
import clsx from 'clsx';

type PageContainerProps = {
  children: React.ReactNode;
  className?: string;
};

const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={clsx(
        'flex',
        'flex-col',
        'items-center',
        'justify-center',
        'h-screen',
        'xl:max-w-[1440px]',
        'm-auto',
        className,
      )}
    >
      {children}
    </div>
  );
};

export default PageContainer;
