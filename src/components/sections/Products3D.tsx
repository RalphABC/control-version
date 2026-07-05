"use client";

import React, { useRef, useState, useLayoutEffect } from 'react';
import Image from 'next/image';
import { Droplets } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { SectionHeading } from '@/components/ui/SectionHeading';

interface Spec { label: string; value: string; }

interface ProductData {
  imageSrc?: string;
  name: string;
  tagline: string;
  specs: Spec[];
  href: string;
}

const Product3DCard = ({
  imageSrc, name, tagline, specs, accentColor, accentColorRgb,
  buttonGradient, index, entered, href,
}: ProductData & {
  accentColor: string; accentColorRgb: string; buttonGradient: string;
  index: number; entered: boolean;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  // Tilt lives in a ref, not state — mousemove fires dozens of times/sec while
  // hovering, and driving it through setState re-rendered this whole card tree
  // that many times, stealing main-thread time from the custom cursor's rAF
  // loop (visible as a "jump" right when approaching these cards).
  const tiltRef = useRef({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const rafRef = useRef(0);

  const delay = index * 0.15;

  const applyTransform = () => {
    const el = cardRef.current;
    if (!el) return;
    const { x, y } = tiltRef.current;
    el.style.transform = entered
      ? `translateY(0) rotateX(${y}deg) rotateY(${x}deg) scale(${hovered ? 1.03 : 1})`
      : 'translateY(60px) rotateX(8deg)';
    el.style.transition = `opacity 0.8s ease ${delay}s, transform ${hovered ? '0.12' : '0.6'}s cubic-bezier(0.34,1.2,0.64,1)`;
  };

  useLayoutEffect(() => {
    applyTransform();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entered, hovered]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    tiltRef.current = {
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 18,
      y: -((e.clientY - rect.top) / rect.height - 0.5) * 18,
    };
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(applyTransform);
  };

  const handleMouseLeave = () => {
    tiltRef.current = { x: 0, y: 0 };
    cancelAnimationFrame(rafRef.current);
    setHovered(false);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        opacity: entered ? 1 : 0,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
    >
      {/* Card shell */}
      <div style={{
        background: 'linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
        border: `1px solid rgba(${accentColorRgb}, ${hovered ? 0.4 : 0.12})`,
        borderRadius: '1.5rem',
        overflow: 'hidden',
        transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
        boxShadow: hovered
          ? `0 30px 80px rgba(0,0,0,0.6), 0 0 40px rgba(${accentColorRgb},0.15), inset 0 1px 0 rgba(255,255,255,0.1)`
          : '0 10px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
        backdropFilter: 'blur(12px)',
      }}>
        {/* Image zone */}
        <div style={{
          position: 'relative', height: '260px', overflow: 'hidden',
          background: `radial-gradient(ellipse at 50% 80%, rgba(${accentColorRgb},0.1) 0%, rgba(0,0,0,0.4) 70%)`,
        }}>
          {/* Gradient top */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '60px',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)',
            zIndex: 2,
          }} />
          {/* Gradient bottom */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px',
            background: 'linear-gradient(to top, rgba(5,5,5,1), transparent)',
            zIndex: 2,
          }} />

          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{
                objectFit: 'cover',
                transform: `scale(${hovered ? 1.08 : 1}) translateZ(20px)`,
                transition: 'transform 0.6s cubic-bezier(0.34,1.2,0.64,1)',
                filter: hovered ? 'brightness(1.1)' : 'brightness(0.85)',
              }}
            />
          ) : (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: `radial-gradient(circle at 50% 45%, rgba(${accentColorRgb},0.18) 0%, transparent 70%)`,
              transform: `scale(${hovered ? 1.08 : 1}) translateZ(20px)`,
              transition: 'transform 0.6s cubic-bezier(0.34,1.2,0.64,1)',
            }}>
              <Droplets
                size={64}
                style={{
                  color: accentColor,
                  opacity: hovered ? 0.9 : 0.5,
                  transition: 'opacity 0.4s ease',
                  filter: `drop-shadow(0 0 24px rgba(${accentColorRgb},0.5))`,
                }}
              />
            </div>
          )}

          {/* Badge */}
          <div style={{
            position: 'absolute', top: '1rem', right: '1rem', zIndex: 3,
            padding: '0.3rem 0.85rem',
            borderRadius: '9999px',
            fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.2em',
            textTransform: 'uppercase',
            background: `rgba(${accentColorRgb},0.2)`,
            color: accentColor,
            border: `1px solid rgba(${accentColorRgb},0.3)`,
            backdropFilter: 'blur(8px)',
          }}>
            Campomaq
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '1.5rem 1.75rem 1.75rem' }}>
          <h3 style={{
            fontSize: '1.4rem', fontWeight: 900,
            letterSpacing: '-0.02em', color: '#fff',
            marginBottom: '0.4rem',
          }}>
            {name}
          </h3>
          <p style={{
            fontSize: '0.85rem', color: 'rgba(255,255,255,0.45)',
            lineHeight: 1.6, marginBottom: '1.5rem',
          }}>
            {tagline}
          </p>

          {/* Specs grid */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: '0.6rem', marginBottom: '1.75rem',
          }}>
            {specs.map((s, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '0.75rem',
                padding: '0.75rem',
              }}>
                <div style={{
                  fontSize: '0.58rem', color: 'rgba(255,255,255,0.35)',
                  textTransform: 'uppercase', letterSpacing: '0.15em',
                  fontWeight: 700, marginBottom: '0.25rem',
                }}>
                  {s.label}
                </div>
                <div style={{
                  fontSize: '0.95rem', fontWeight: 800,
                  color: accentColor, lineHeight: 1,
                }}>
                  {s.value}
                </div>
              </div>
            ))}
          </div>

          {/* CTA link */}
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.85rem',
              borderRadius: '0.85rem',
              background: hovered ? buttonGradient : `rgba(${accentColorRgb},0.12)`,
              border: `1px solid rgba(${accentColorRgb},${hovered ? 0 : 0.2})`,
              color: hovered ? '#000' : accentColor,
              fontSize: '0.8rem', fontWeight: 800,
              letterSpacing: '0.05em',
              textDecoration: 'none',
              transition: 'all 0.35s ease',
              fontFamily: 'inherit',
            }}
          >
            Ver producto →
          </a>
        </div>
      </div>
    </div>
  );
};

const motocultoresData: ProductData[] = [
  {
    imageSrc: '/images/motocultor-1.jpg',
    name: 'AgroForce 700',
    tagline: 'El más vendido del Ecuador. Potencia y durabilidad en cada surco.',
    specs: [
      { label: 'Motor', value: '7 HP' },
      { label: 'Peso', value: '85 kg' },
      { label: 'Ancho labor', value: '60–90 cm' },
      { label: 'Garantía', value: '2 años' },
    ],
    href: 'https://www.campomaq.com.ec/productos/',
  },
  {
    imageSrc: '/images/motocultor-2.jpg',
    name: 'TerraMax Pro',
    tagline: 'Para suelos duros y pendientes pronunciadas. Control total.',
    specs: [
      { label: 'Motor', value: '9 HP' },
      { label: 'Peso', value: '110 kg' },
      { label: 'Profundidad', value: '25 cm' },
      { label: 'Garantía', value: '3 años' },
    ],
    href: 'https://www.campomaq.com.ec/productos/',
  },
  {
    imageSrc: '/images/motocultor-3.jpg',
    name: 'FieldMaster S',
    tagline: 'Compacto y ágil. Ideal para pequeñas y medianas parcelas.',
    specs: [
      { label: 'Motor', value: '5.5 HP' },
      { label: 'Peso', value: '68 kg' },
      { label: 'Arranque', value: 'Eléctrico' },
      { label: 'Garantía', value: '2 años' },
    ],
    href: 'https://www.campomaq.com.ec/productos/',
  },
];

const bombasData: ProductData[] = [
  {
    imageSrc: '/images/bomba-5.jpg',
    name: 'SprayJet 20L',
    tagline: 'Fumigación de precisión. Menos producto, más cobertura.',
    specs: [
      { label: 'Capacidad', value: '20 L' },
      { label: 'Presión', value: '3 bar' },
      { label: 'Tipo', value: 'Motor 2T' },
      { label: 'Garantía', value: '1 año' },
    ],
    href: 'https://www.campomaq.com.ec/productos/',
  },
  {
    imageSrc: '/images/bomba-4.jpg',
    name: 'AquaForce 30L',
    tagline: 'Alta potencia para cultivos extensos. Alcance de hasta 12 metros.',
    specs: [
      { label: 'Capacidad', value: '30 L' },
      { label: 'Alcance', value: '12 m' },
      { label: 'Motor', value: '4 tiempos' },
      { label: 'Garantía', value: '2 años' },
    ],
    href: 'https://www.campomaq.com.ec/productos/',
  },
  {
    imageSrc: '/images/bomba-2.jpg',
    name: 'NebTech Elite',
    tagline: 'Tecnología de nebulización fina. Protección sin desperdicios.',
    specs: [
      { label: 'Capacidad', value: '16 L' },
      { label: 'Boquillas', value: '3 tipos' },
      { label: 'Tipo', value: 'Eléctrica' },
      { label: 'Garantía', value: '18 meses' },
    ],
    href: 'https://www.campomaq.com.ec/productos/',
  },
];

export const Products3D = () => {
  const { isMotocultores, accentColor, accentColorRgb, buttonGradient } = useTheme();
  const { ref, entered } = useScrollReveal<HTMLDivElement>(0.1);

  const activeData = isMotocultores ? motocultoresData : bombasData;

  return (
    <section
      id="productos"
      style={{
        position: 'relative',
        padding: '8rem 1.5rem',
        background: 'linear-gradient(to bottom, #000 0%, #050505 40%, #0a0a0a 70%, #000 100%)',
        overflow: 'hidden',
      }}
    >
      {/* ── Background geometry ── */}
      {/* Grid lines */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(rgba(${accentColorRgb},0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(${accentColorRgb},0.03) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        transition: 'background-image 1s ease',
      }} />
      {/* Center glow */}
      <div style={{
        position: 'absolute', top: '30%', left: '50%',
        transform: 'translate(-50%,-50%)',
        width: 800, height: 600,
        borderRadius: '50%',
        background: `radial-gradient(ellipse, rgba(${accentColorRgb},0.05) 0%, transparent 70%)`,
        pointerEvents: 'none',
        transition: 'background 1s ease',
      }} />

      <div ref={ref} style={{ maxWidth: '72rem', margin: '0 auto' }}>
        <SectionHeading
          title={isMotocultores ? 'Motocultores de élite' : 'Bombas de alta precisión'}
          eyebrow={isMotocultores ? 'Ingeniería para el campo' : 'Tecnología de fumigación'}
          accentColor={accentColor}
          accentColorRgb={accentColorRgb}
          entered={entered}
        />

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          perspective: '1200px',
        }}>
          {activeData.map((product, i) => (
            <Product3DCard
              key={`${isMotocultores ? 'moto' : 'bomba'}-${i}`}
              {...product}
              accentColor={accentColor}
              accentColorRgb={accentColorRgb}
              buttonGradient={buttonGradient}
              index={i}
              entered={entered}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
