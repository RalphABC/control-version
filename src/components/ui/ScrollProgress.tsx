"use client";

import { useEffect, useRef } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export const ScrollProgress = () => {
  const { accentColor } = useTheme();
  // Direct DOM update instead of React state — this ran on every native scroll
  // event (many times per second), and setState there forced a full re-render
  // on every tick, which was a major contributor to the scroll lag.
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const total = el.scrollHeight - el.clientHeight;
      const progress = total > 0 ? (el.scrollTop / total) * 100 : 0;
      if (fillRef.current) fillRef.current.style.width = `${progress}%`;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0,
      height: '2px', zIndex: 9000,
      background: 'rgba(255,255,255,0.05)',
    }}>
      <div ref={fillRef} style={{
        height: '100%',
        width: '0%',
        background: accentColor,
        transition: 'width 0.1s linear, background 0.6s ease',
        boxShadow: `0 0 8px ${accentColor}80`,
      }} />
    </div>
  );
};
