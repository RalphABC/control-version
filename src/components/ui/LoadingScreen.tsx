"use client";

import { useEffect, useState } from 'react';

export const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); return 100; }
        return p + Math.random() * 18 + 4;
      });
    }, 120);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const t = setTimeout(() => setFadeOut(true), 300);
      return () => clearTimeout(t);
    }
  }, [progress]);

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: '#000',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        transition: 'opacity 0.6s ease',
        opacity: fadeOut ? 0 : 1,
        pointerEvents: fadeOut ? 'none' : 'all',
      }}
    >
      {/* Logo area */}
      <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <div style={{
          fontSize: '0.65rem', letterSpacing: '0.5em',
          color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase',
          marginBottom: '1.5rem', fontWeight: 600,
        }}>
          Campomaq — Soluciones Agrícolas
        </div>
        {/* Animated icon */}
        <div style={{ position: 'relative', width: 80, height: 80, margin: '0 auto' }}>
          <div style={{
            position: 'absolute', inset: 0,
            borderRadius: '50%',
            border: '1px solid rgba(250,204,21,0.2)',
            animation: 'cm-ping 1.4s ease-out infinite',
          }} />
          <div style={{
            position: 'absolute', inset: 8,
            borderRadius: '50%',
            border: '1px solid rgba(250,204,21,0.15)',
            animation: 'cm-ping 1.4s ease-out 0.3s infinite',
          }} />
          <div style={{
            position: 'absolute', inset: '50%',
            transform: 'translate(-50%,-50%)',
            width: 32, height: 32,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #FACC15, #F59E0B)',
            boxShadow: '0 0 30px rgba(250,204,21,0.4)',
          }} />
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ width: 200, height: 1, background: 'rgba(255,255,255,0.08)', borderRadius: 2 }}>
        <div style={{
          height: '100%',
          width: `${Math.min(progress, 100)}%`,
          background: 'linear-gradient(to right, #FACC15, #F59E0B)',
          borderRadius: 2,
          transition: 'width 0.15s ease',
          boxShadow: '0 0 8px rgba(250,204,21,0.5)',
        }} />
      </div>
    </div>
  );
};
