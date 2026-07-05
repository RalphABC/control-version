"use client";

import { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export const CustomCursor = () => {
  const { accentColor, accentColorRgb } = useTheme();
  const [mounted, setMounted] = useState(false);

  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<HTMLDivElement[]>([]);

  // Mouse coords (target positions)
  const mousePos = useRef({ x: -100, y: -100 });
  const currentPos = useRef({ x: -100, y: -100 });
  
  // Array to store the previous positions of each dot in the trail
  const trailPositions = useRef<{ x: number; y: number }[]>(
    Array(6).fill(null).map(() => ({ x: -100, y: -100 }))
  );

  useEffect(() => {
    setMounted(true);
    
    // Check if device supports hover/pointer (desktop vs touch)
    const hasHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!hasHover) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Unified stable hover check to prevent cursor bouncing/flickering
    let isHoveringInteractive = false;
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isOverInteractive = !!(
        target &&
        (target.tagName === 'A' ||
          target.tagName === 'BUTTON' ||
          target.closest('a') ||
          target.closest('button') ||
          target.getAttribute('role') === 'button')
      );

      if (isOverInteractive !== isHoveringInteractive) {
        isHoveringInteractive = isOverInteractive;
        if (cursorRef.current) {
          cursorRef.current.style.scale = isOverInteractive ? '1.35' : '1';
        }
      }
    };

    window.addEventListener('mouseover', handleMouseOver, { passive: true });

    let frameId = 0;
    let lastTime = performance.now();
    const updateCursor = (time: number) => {
      // Frame-rate independent lerp: a fixed per-frame ratio (e.g. 0.35) assumes
      // ~60fps. If the main thread stalls (e.g. a hover re-render elsewhere),
      // the next frame would otherwise jump by a much larger fraction of the
      // accumulated distance, reading as a "jump" near buttons/cards. Scaling
      // the ratio by elapsed time keeps the perceived speed constant instead.
      const dt = Math.min(time - lastTime, 100);
      lastTime = time;
      const posFactor = 1 - Math.pow(1 - 0.35, dt / 16.6667);

      currentPos.current.x += (mousePos.current.x - currentPos.current.x) * posFactor;
      currentPos.current.y += (mousePos.current.y - currentPos.current.y) * posFactor;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${currentPos.current.x - 12}px, ${currentPos.current.y - 12}px, 0)`;
      }

      // Lerp trail dots
      let prevX = currentPos.current.x;
      let prevY = currentPos.current.y;

      trailPositions.current.forEach((pos, index) => {
        // Each dot follows the previous dot's position with slightly different speed/friction
        const speed = 1 - Math.pow(1 - (0.3 - index * 0.035), dt / 16.6667);
        pos.x += (prevX - pos.x) * speed;
        pos.y += (prevY - pos.y) * speed;

        const el = trailRefs.current[index];
        if (el) {
          el.style.transform = `translate3d(${pos.x - 4}px, ${pos.y - 4}px, 0)`;
        }

        prevX = pos.x;
        prevY = pos.y;
      });

      frameId = requestAnimationFrame(updateCursor);
    };

    frameId = requestAnimationFrame(updateCursor);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(frameId);
    };
  }, []);

  if (!mounted) return null;

  // We check media query in JS too, just to be safe not to render on touch devices
  if (typeof window !== 'undefined' && !window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    return null;
  }

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 99999 }}>
      {/* Trail dots */}
      {Array(6).fill(0).map((_, i) => (
        <div
          key={i}
          ref={el => { if (el) trailRefs.current[i] = el; }}
          style={{
            position: 'absolute',
            width: 8 - i * 1.1,
            height: 8 - i * 1.1,
            borderRadius: '50%',
            background: accentColor,
            opacity: (0.42 - i * 0.06),
            transition: 'background 0.4s ease, opacity 0.4s ease',
            willChange: 'transform',
            boxShadow: `0 0 10px rgba(${accentColorRgb}, 0.5)`,
          }}
        />
      ))}

      {/* Main Machine Icon Cursor */}
      <div
        ref={cursorRef}
        style={{
          position: 'absolute',
          width: 24,
          height: 24,
          willChange: 'transform',
          transition: 'scale 0.2s ease',
          filter: `drop-shadow(0 0 6px rgba(${accentColorRgb}, 0.5))`,
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'stroke 0.4s ease' }}>
          {/* Tractor / Agricultural Machine representation */}
          <circle cx="6" cy="17" r="3" />
          <circle cx="17" cy="15" r="5" />
          <path d="M6 14h6M9 14V9h5v5M12 9V6h2M14 10h3" />
        </svg>
      </div>
    </div>
  );
};
