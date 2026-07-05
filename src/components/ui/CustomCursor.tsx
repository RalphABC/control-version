"use client";

import { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

const TRAIL_COUNT = 7;

export const CustomCursor = () => {
  const { accentColor, accentColorRgb } = useTheme();
  const [mounted, setMounted] = useState(false);

  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<HTMLDivElement[]>([]);

  // Real mouse position — the icon tracks this directly (see handleMouseMove),
  // never through a lerp. Only the decorative trail lags behind it.
  const mousePos = useRef({ x: -100, y: -100 });

  // Array to store the previous positions of each dot in the trail
  const trailPositions = useRef<{ x: number; y: number }[]>(
    Array(TRAIL_COUNT).fill(null).map(() => ({ x: -100, y: -100 }))
  );

  useEffect(() => {
    setMounted(true);

    // Check if device supports hover/pointer (desktop vs touch)
    const hasHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!hasHover) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      // The icon is moved here, synchronously with the real cursor position —
      // not through the rAF lerp below. Any smoothing on the icon itself lets
      // it drift away from where the invisible native cursor actually is
      // (which still drives real hover/click hit-testing), and that gap reads
      // as the icon "jumping" to catch up. Only the trail is allowed to lag.
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX - 12}px, ${e.clientY - 12}px, 0)`;
      }

      ensureTrailRunning();
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
    let trailRunning = false;

    const updateTrail = (time: number) => {
      const dt = Math.min(time - lastTime, 100);
      lastTime = time;

      // Chain-lerp: each dot eases toward the previous one, starting from the
      // real (unlagged) mouse position — this is what produces the soft,
      // elongating "estela" without ever letting the main icon itself lag.
      let prevX = mousePos.current.x;
      let prevY = mousePos.current.y;
      let maxDelta = 0;

      trailPositions.current.forEach((pos, index) => {
        const speed = 1 - Math.pow(1 - (0.32 - index * 0.028), dt / 16.6667);
        const dx = (prevX - pos.x) * speed;
        const dy = (prevY - pos.y) * speed;
        pos.x += dx;
        pos.y += dy;
        maxDelta = Math.max(maxDelta, Math.abs(dx), Math.abs(dy));

        const el = trailRefs.current[index];
        if (el) {
          const size = 9 - index * 0.95;
          el.style.transform = `translate3d(${pos.x - size / 2}px, ${pos.y - size / 2}px, 0)`;
        }

        prevX = pos.x;
        prevY = pos.y;
      });

      // Once every dot has caught up to the mouse, stop asking for frames
      // instead of spinning requestAnimationFrame forever while idle — the
      // page shouldn't keep painting 60 times a second just because a tab is
      // open and the mouse hasn't moved.
      if (maxDelta > 0.05) {
        frameId = requestAnimationFrame(updateTrail);
      } else {
        trailRunning = false;
      }
    };

    const ensureTrailRunning = () => {
      if (trailRunning) return;
      trailRunning = true;
      lastTime = performance.now();
      frameId = requestAnimationFrame(updateTrail);
    };

    ensureTrailRunning();

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
      {/* Trail dots — soft, blurred, fading glow that elongates behind the
          icon. Blur increases and opacity/size fall off down the tail so it
          reads as one continuous wisp rather than a row of discrete dots. */}
      {Array(TRAIL_COUNT).fill(0).map((_, i) => {
        const size = 9 - i * 0.95;
        return (
          <div
            key={i}
            ref={el => { if (el) trailRefs.current[i] = el; }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: size,
              height: size,
              borderRadius: '50%',
              background: accentColor,
              opacity: 0.5 - i * 0.062,
              filter: `blur(${0.4 + i * 0.35}px)`,
              transition: 'background 0.4s ease, opacity 0.4s ease',
              willChange: 'transform',
              transform: 'translate3d(-100px, -100px, 0)',
              boxShadow: `0 0 ${7 + i}px rgba(${accentColorRgb}, ${0.4 - i * 0.04})`,
            }}
          />
        );
      })}

      {/* Main Machine Icon Cursor — tracks the real mouse position 1:1 */}
      <div
        ref={cursorRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 24,
          height: 24,
          willChange: 'transform',
          transform: 'translate3d(-112px, -112px, 0)',
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
