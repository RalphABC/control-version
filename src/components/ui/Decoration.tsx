import React, { type ReactNode } from 'react';

interface DecorationProps {
  opacity?: number;
  className?: string;
  children: ReactNode;
}

export const Decoration = ({ opacity = 1, className = '', children }: DecorationProps) => {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none select-none ${className}`}
      style={{ opacity }}
    >
      {children}
    </div>
  );
};
