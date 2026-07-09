import React, { type ReactNode } from 'react';

interface SurfaceProps {
  className?: string;
  children: ReactNode;
}

export const Surface = ({ className = '', children }: SurfaceProps) => {
  return (
    <div className={`rounded-3xl bg-surface border border-line backdrop-blur-md p-6 shadow-2xl ${className}`}>
      {children}
    </div>
  );
};
