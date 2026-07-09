"use client";

import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export const FloatingContact = () => {
  const { accentColor } = useTheme();
  const [hovered, setHovered] = useState(false);

  const wsppUrl = "https://wa.me/593980582555?text=Hola%20Campomaq,%20estoy%20interesado%20en%20adquirir%20el%20Motocultor%20Titan%20Pro%20de%2016%20HP.%20%C2%BFMe%20podr%C3%ADan%20dar%20m%C3%A1s%20informaci%C3%B3n?";

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 99,
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
      }}
    >
      {/* Tooltip text showing on hover */}
      <div
        style={{
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '0.5rem 1rem',
          borderRadius: '0.75rem',
          fontSize: '0.75rem',
          fontWeight: 700,
          color: '#fff',
          letterSpacing: '0.05em',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'translateX(0)' : 'translateX(10px)',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        ¿Tiene preguntas? ¡Escríbenos!
      </div>

      {/* Floating pulsing button */}
      <a
        href={wsppUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: '#22C55E',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: hovered 
            ? '0 15px 30px rgba(34, 197, 94, 0.5), 0 0 20px rgba(34, 197, 94, 0.3)' 
            : '0 8px 20px rgba(0,0,0,0.3)',
          transform: hovered ? 'scale(1.1) translateY(-3px)' : 'scale(1) translateY(0)',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          position: 'relative',
          cursor: 'pointer',
        }}
        aria-label="Contactar por WhatsApp"
      >
        {/* Pulsing ring animation */}
        <div
          style={{
            position: 'absolute',
            inset: '-6px',
            borderRadius: '50%',
            border: '2px solid #22C55E',
            opacity: 0,
            animation: 'cm-ping 2s infinite',
            pointerEvents: 'none',
          }}
        />

        {/* Custom SVG WhatsApp Icon */}
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      </a>
    </div>
  );
};
