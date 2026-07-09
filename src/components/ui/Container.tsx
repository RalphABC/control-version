import React, { type ReactNode } from 'react';

type ContainerVariant = 'prose' | 'content' | 'wide' | 'bleed';

interface ContainerProps {
  variant?: ContainerVariant;
  className?: string;
  children: ReactNode;
}

export const Container = ({ variant = 'content', className = '', children }: ContainerProps) => {
  const maxWClass = {
    prose: 'max-w-[68ch]',
    content: 'max-w-5xl',
    wide: 'max-w-7xl',
    bleed: 'max-w-full',
  }[variant];

  return (
    <div className={`w-full mx-auto px-6 ${maxWClass} ${className}`}>
      {children}
    </div>
  );
};
