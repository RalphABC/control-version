import React, { type ReactNode } from 'react';

interface EyebrowProps {
  children: ReactNode;
}

export const Eyebrow = ({ children }: EyebrowProps) => {
  return (
    <span className="inline-block text-[0.62rem] font-bold tracking-[0.45em] uppercase text-brand mb-4">
      {children}
    </span>
  );
};
