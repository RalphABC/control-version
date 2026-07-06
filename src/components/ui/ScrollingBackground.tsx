"use client";

import { useEffect, useRef } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

// One repeatable tile: a thin nested-chevron motif (top pointing down,
// bottom pointing up) fading from accent color to transparent, with a
// generous black gap between top/bottom pairs — mirrors the reference
// wallpaper without the lines being thick enough to merge into solid blocks.
const TILE_W = 480;
const TILE_H = 1300;

const buildTile = (accent: string) => {
  const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' width='${TILE_W}' height='${TILE_H}' viewBox='0 0 ${TILE_W} ${TILE_H}'>
      <defs>
        <linearGradient id='g' x1='0' y1='0' x2='1' y2='0'>
          <stop offset='0%' stop-color='${accent}' stop-opacity='0'/>
          <stop offset='50%' stop-color='${accent}' stop-opacity='0.75'/>
          <stop offset='100%' stop-color='${accent}' stop-opacity='0'/>
        </linearGradient>
      </defs>
      <path d='M -80 -90 L 240 170 L 560 -90' stroke='url(#g)' stroke-width='12' fill='none'/>
      <path d='M -80 40 L 240 300 L 560 40' stroke='url(#g)' stroke-width='7' fill='none' opacity='0.4'/>
      <path d='M -80 170 L 240 430 L 560 170' stroke='url(#g)' stroke-width='4' fill='none' opacity='0.22'/>
      <path d='M -80 ${TILE_H + 90} L 240 ${TILE_H - 170} L 560 ${TILE_H + 90}' stroke='url(#g)' stroke-width='12' fill='none'/>
      <path d='M -80 ${TILE_H - 40} L 240 ${TILE_H - 300} L 560 ${TILE_H - 40}' stroke='url(#g)' stroke-width='7' fill='none' opacity='0.4'/>
      <path d='M -80 ${TILE_H - 170} L 240 ${TILE_H - 430} L 560 ${TILE_H - 170}' stroke='url(#g)' stroke-width='4' fill='none' opacity='0.22'/>
    </svg>
  `.replace(/\s+/g, ' ').trim();

  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
};

// Fixed, page-wide chevron pattern sitting behind every section. Its
// background-position is nudged on scroll (at a fraction of scroll speed)
// so the pattern visibly drifts as the page slides, instead of sitting
// static like a plain wallpaper. Kept at low opacity so it reads as
// ambient texture rather than fighting with foreground content.
export const ScrollingBackground = () => {
  const { accentColor } = useTheme();
  const bgRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const handler = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        if (!bgRef.current) return;
        const offset = (window.scrollY * 0.4) % TILE_H;
        bgRef.current.style.backgroundPosition = `center ${-offset}px`;
      });
    };
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    return () => {
      window.removeEventListener('scroll', handler);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={bgRef}
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        background: '#000',
        backgroundImage: buildTile(accentColor),
        backgroundRepeat: 'repeat',
        backgroundSize: `${TILE_W}px ${TILE_H}px`,
        backgroundPosition: 'center top',
        opacity: 0.55,
        transition: 'opacity 0.6s ease',
      }}
    />
  );
};
