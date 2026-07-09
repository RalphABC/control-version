"use client";

import { useEffect, useState, useRef } from 'react';
import { QrCode, Smartphone, Scan } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export const QRCodeSection = () => {
  const { accentColor, accentColorRgb } = useTheme();
  const { ref, entered } = useScrollReveal<HTMLDivElement>(0.2);
  const [currentUrl, setCurrentUrl] = useState('https://www.campomaq.com.ec');
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
  }, []);

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(currentUrl)}&color=000000&bgcolor=FFFFFF`;

  return (
    <section
      ref={ref}
      id="qr-section"
      style={{
        position: 'relative',
        padding: '6rem 1.5rem',
        background: 'rgba(5, 5, 5, 0.95)',
        overflow: 'hidden',
      }}
    >
      {/* Decorative background grid and glow */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '500px',
        height: '350px',
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(${accentColorRgb}, 0.03) 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      <div style={{
        maxWidth: '52rem',
        margin: '0 auto',
        opacity: entered ? 1 : 0,
        transform: entered ? 'translateY(0)' : 'translateY(40px)',
        transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        position: 'relative',
        zIndex: 10,
      }}>
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
            border: `1px solid ${hovered ? `rgba(${accentColorRgb}, 0.3)` : 'rgba(255,255,255,0.06)'}`,
            borderRadius: '2rem',
            padding: '2.5rem 2rem',
            boxShadow: hovered 
              ? `0 30px 60px rgba(0,0,0,0.6), 0 0 40px rgba(${accentColorRgb}, 0.1), inset 0 1px 0 rgba(255,255,255,0.08)`
              : '0 15px 35px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)',
            backdropFilter: 'blur(16px)',
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '2.5rem',
            alignItems: 'center',
            transition: 'all 0.4s ease',
          }}
          className="md:grid-cols-12"
        >
          {/* Left: Text & Value proposition */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="md:col-span-8">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.65rem',
              fontWeight: 800,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: accentColor,
            }}>
              <Scan size={14} />
              Acceso Móvil Instantáneo
            </div>

            <h3 style={{
              fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
              fontWeight: 900,
              color: '#fff',
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
            }}>
              Lleva la ficha de <span style={{ color: accentColor }}>Titan PRO</span> en tu bolsillo
            </h3>

            <p style={{
              fontSize: '0.9rem',
              color: 'rgba(255, 255, 255, 0.45)',
              lineHeight: 1.6,
            }}>
              Escanea este código QR con la cámara de tu celular para acceder de forma inmediata a esta página desde cualquier lugar. Explora especificaciones detalladas, visualiza el modelo 3D y realiza consultas directamente desde el campo de trabajo.
            </p>

            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', fontWeight: 600 }}>
                <Smartphone size={14} style={{ color: accentColor }} />
                <span>Compatible con iOS & Android</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', fontWeight: 600 }}>
                <QrCode size={14} style={{ color: accentColor }} />
                <span>Escaneo rápido sin apps extra</span>
              </div>
            </div>
          </div>

          {/* Right: Elegant QR container */}
          <div style={{ display: 'flex', justifyContent: 'center' }} className="md:col-span-4">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  background: '#fff',
                  padding: '1rem',
                  borderRadius: '1.5rem',
                  boxShadow: `0 15px 35px rgba(0,0,0,0.5), 0 0 30px rgba(${accentColorRgb}, 0.1)`,
                  border: `2px solid ${hovered ? accentColor : 'transparent'}`,
                  transition: 'all 0.4s ease',
                  transform: hovered ? 'scale(1.05)' : 'scale(1)',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrImageUrl}
                  alt="Código QR de la página"
                  width={150}
                  height={150}
                  style={{ display: 'block' }}
                />
              </div>
              <span style={{
                fontSize: '0.65rem',
                color: hovered ? '#fff' : 'rgba(255,255,255,0.4)',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                transition: 'color 0.3s ease',
              }}>
                [ Escanear con Cámara ]
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
