"use client";

import { useState } from 'react';
import { Play } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { SectionHeading } from '@/components/ui/SectionHeading';

export const YoutubeVideo = () => {
  const { accentColor, accentColorRgb } = useTheme();
  const { ref, entered } = useScrollReveal<HTMLDivElement>(0.15);
  const [playActive, setPlayActive] = useState(false);
  const [btnHovered, setBtnHovered] = useState(false);

  return (
    <section
      id="video-demo"
      style={{
        position: 'relative',
        padding: '8rem 1.5rem',
        background: 'rgba(0, 0, 0, 0.82)',
        overflow: 'hidden',
      }}
    >
      {/* Background decoration */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '400px',
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(${accentColorRgb}, 0.04) 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      <div ref={ref} style={{ maxWidth: '72rem', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        <SectionHeading
          title="Titan PRO en Acción"
          eyebrow="Demostración en Vivo"
          accentColor={accentColor}
          accentColorRgb={accentColorRgb}
          entered={entered}
        />

        {/* Video Box Wrapper */}
        <div
          style={{
            opacity: entered ? 1 : 0,
            transform: entered ? 'translateY(0)' : 'translateY(40px)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
            background: 'rgba(255, 255, 255, 0.02)',
            border: `1px solid rgba(${accentColorRgb}, 0.15)`,
            borderRadius: '2rem',
            padding: '1rem',
            boxShadow: `0 30px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(${accentColorRgb}, 0.05)`,
            maxWidth: '48rem',
            margin: '0 auto',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'relative',
              paddingBottom: '56.25%', // 16:9 Aspect Ratio
              height: 0,
              overflow: 'hidden',
              borderRadius: '1.5rem',
              boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.8)',
              background: '#0a0a0a',
            }}
          >
            {!playActive ? (
              <div
                onClick={() => setPlayActive(true)}
                onMouseEnter={() => setBtnHovered(true)}
                onMouseLeave={() => setBtnHovered(false)}
                style={{
                  position: 'absolute',
                  inset: 0,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundImage: "url('/images/titan_pro_2.jpg')", // Scenic outdoor image of tractor
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {/* Dark tint overlay */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: btnHovered ? 'rgba(0,0,0,0.45)' : 'rgba(0,0,0,0.6)',
                  transition: 'background 0.4s ease',
                  zIndex: 1,
                }} />

                {/* Pulse Ring */}
                <div style={{
                  position: 'absolute',
                  width: '84px',
                  height: '84px',
                  borderRadius: '50%',
                  border: `2px solid ${accentColor}`,
                  opacity: btnHovered ? 0.8 : 0.4,
                  transform: btnHovered ? 'scale(1.15)' : 'scale(1)',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  animation: btnHovered ? 'none' : 'cm-ping 2s infinite',
                  zIndex: 2,
                  pointerEvents: 'none',
                }} />

                {/* Central Play Button */}
                <div style={{
                  position: 'relative',
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: btnHovered ? accentColor : 'rgba(255,255,255,0.08)',
                  border: `1px solid ${btnHovered ? 'transparent' : 'rgba(255,255,255,0.2)'}`,
                  backdropFilter: 'blur(8px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: btnHovered ? `0 0 35px rgba(${accentColorRgb}, 0.5)` : '0 10px 30px rgba(0,0,0,0.5)',
                  transform: btnHovered ? 'scale(1.1)' : 'scale(1)',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  zIndex: 3,
                }}>
                  <Play 
                    size={22} 
                    fill={btnHovered ? '#000' : accentColor} 
                    stroke={btnHovered ? '#000' : accentColor}
                    style={{ 
                      marginLeft: '4px',
                      transition: 'all 0.4s ease'
                    }} 
                  />
                </div>
              </div>
            ) : (
              <iframe
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 0,
                }}
                src="https://www.youtube.com/embed/0yqK_h3speU?autoplay=1"
                title="Demo Motocultor Titan Pro"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            )}
          </div>
        </div>

        <p
          style={{
            fontSize: '0.85rem',
            color: 'rgba(255, 255, 255, 0.45)',
            textAlign: 'center',
            maxWidth: '32rem',
            margin: '2rem auto 0',
            lineHeight: 1.6,
            opacity: entered ? 1 : 0,
            transition: 'opacity 0.8s ease 0.4s',
          }}
        >
          Observa el desempeño, la maniobrabilidad y la fuerza bruta de arrastre de nuestro motocultor estrella diésel de 16 HP en condiciones de labranza reales.
        </p>
      </div>
    </section>
  );
};
