import React from 'react';

interface GradientTextProps {
  /** CSS gradient, e.g. "linear-gradient(135deg, #fff, #000)" */
  gradient: string;
  /** Animate the gradient position (used for the hero title accent) */
  animate?: boolean;
  as?: 'span' | 'div';
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export const GradientText = ({ gradient, animate, as: Tag = 'span', style, children }: GradientTextProps) => (
  <Tag
    style={{
      backgroundImage: gradient,
      backgroundSize: animate ? '200% 100%' : '100% 100%',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      color: 'transparent',
      animation: animate ? 'cm-gradient-shift 4s ease infinite' : undefined,
      transition: 'background-image 0.6s ease',
      ...style,
    }}
  >
    {children}
  </Tag>
);
