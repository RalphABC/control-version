import React, { type ReactNode } from 'react';

interface SectionProps {
  id?: string;
  className?: string;
  children: ReactNode;
}

export const Section = ({ id, className = '', children }: SectionProps) => {
  return (
    <section
      id={id}
      className={`py-32 relative overflow-hidden bg-ink ${className}`}
    >
      {children}
    </section>
  );
};
