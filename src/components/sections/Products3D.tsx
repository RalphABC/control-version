"use client";

import React, { useRef, useState, useLayoutEffect } from 'react';
import Image from 'next/image';
import { Droplets, ShieldCheck, Settings, ShoppingBag, Eye, Zap, Scale } from 'lucide-react';
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
        position: 'relative',
      }}
    >
      <div style={{
        position: 'absolute',
        inset: '-10px',
        background: `radial-gradient(circle, rgba(${accentColorRgb}, 0.28) 0%, transparent 70%)`,
        filter: 'blur(30px)',
        opacity: hovered ? 1 : 0,
        transform: `scale(${hovered ? 1.05 : 0.9})`,
        transition: 'opacity 0.4s ease, transform 0.4s ease',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      <div style={{
        position: 'relative',
        zIndex: 1,
        background: 'linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
        border: `1px solid rgba(${accentColorRgb}, ${hovered ? 0.45 : 0.12})`,
        borderRadius: '1.5rem',
        overflow: 'hidden',
        transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
        boxShadow: hovered
          ? `0 30px 80px rgba(0,0,0,0.7), 0 0 50px rgba(${accentColorRgb},0.28), inset 0 1px 0 rgba(255,255,255,0.15)`
          : '0 10px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
        backdropFilter: 'blur(12px)',
      }}>
        <div style={{
          position: 'relative', height: '260px', overflow: 'hidden',
          background: `radial-gradient(ellipse at 50% 80%, rgba(${accentColorRgb},0.1) 0%, rgba(0,0,0,0.4) 70%)`,
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '60px',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)',
            zIndex: 2,
          }} />
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

const bombasData: ProductData[] = [
  {
    imageSrc: '/images/B01.png',
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
    imageSrc: '/images/B02.png',
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
    imageSrc: '/images/B03.png',
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

const titanProImages = [
  '/images/M04.png',
  '/images/M02.png',
  '/images/M06.png',
];

const titanProSpecs = [
  { 
    label: 'Motor diésel', 
    value: '16 HP (456 cc) de alto torque', 
    detail: 'Inyección directa para un máximo ahorro de combustible.',
    category: 'fuerza'
  },
  { 
    label: 'Arranque', 
    value: 'Eléctrico y Manual', 
    detail: 'Arranque rápido por llave con batería de 12V integrada.',
    category: 'fuerza'
  },
  { 
    label: 'Velocidades', 
    value: '6 velocidades (3 adelante + 3 reversa)', 
    detail: 'Caja de cambios sincronizada de gran precisión.',
    category: 'operacion'
  },
  { 
    label: 'Transmisión', 
    value: 'Engranajes robustos en baño de aceite', 
    detail: 'Sistema sellado resistente a filtraciones de lodo y agua.',
    category: 'operacion'
  },
  { 
    label: 'Ancho de trabajo', 
    value: 'Ajustable (40 cm, 45 cm, 50 cm)', 
    detail: 'Fresas desmontables adaptables al tipo de labranza.',
    category: 'operacion'
  },
  { 
    label: 'Profundidad', 
    value: 'Regulable de 15 cm a 30 cm', 
    detail: 'Control manual directo para diferentes perfiles de suelo.',
    category: 'operacion'
  },
  { 
    label: 'Peso del equipo', 
    value: '162 kg (adherencia garantizada)', 
    detail: 'Tracción optimizada para evitar patinajes sin compactar.',
    category: 'soporte'
  },
  { 
    label: 'Capacidad remolque', 
    value: 'Hasta 1000 kg con remolque', 
    detail: 'Chasis reforzado con acople de tiro para carga pesada.',
    category: 'soporte'
  },
  { 
    label: 'Garantía oficial', 
    value: '2 Años de respaldo oficial', 
    detail: 'Servicio técnico especializado y stock completo de repuestos.',
    category: 'soporte'
  },
];

const SpecRow = ({ label, value, detail }: { label: string; value: string; detail?: string }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '0.55rem 0.75rem',
        borderRadius: '0.75rem',
        background: hovered ? 'rgba(255, 255, 255, 0.025)' : 'transparent',
        border: hovered ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid transparent',
        transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        transform: hovered ? 'translateX(4px)' : 'translateX(0)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ 
          fontSize: '0.78rem', 
          color: hovered ? '#fff' : 'rgba(255, 255, 255, 0.4)', 
          fontWeight: 500,
          transition: 'color 0.25s ease'
        }}>
          {label}
        </span>
        <span style={{ 
          fontSize: '0.82rem', 
          color: hovered ? 'var(--color-brand)' : '#fff', 
          fontWeight: 700, 
          textAlign: 'right',
          transition: 'color 0.25s ease'
        }}>
          {value}
        </span>
      </div>
      {detail && (
        <span style={{ 
          fontSize: '0.66rem', 
          color: hovered ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.25)', 
          marginTop: '0.2rem',
          transition: 'color 0.25s ease',
          lineHeight: 1.3
        }}>
          {detail}
        </span>
      )}
    </div>
  );
};

export const Products3D = () => {
  const { isMotocultores, accentColor, accentColorRgb, buttonGradient } = useTheme();
  const { ref, entered } = useScrollReveal<HTMLDivElement>(0.1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [wsppHovered, setWsppHovered] = useState(false);
  const [galleryHovered, setGalleryHovered] = useState(false);

  const wsppUrl = "https://wa.me/593980582555?text=Hola%20Campomaq,%20estoy%20interesado%20en%20adquirir%20el%20Motocultor%20Titan%20Pro%20de%2016%20HP.%20%C2%BFMe%20podr%C3%ADan%20dar%20m%C3%A1s%20informaci%C3%B3n?";

  return (
    <section
      id="productos"
      style={{
        position: 'relative',
        padding: '8rem 1.5rem',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.82) 0%, rgba(5,5,5,0.82) 40%, rgba(10,10,10,0.82) 70%, rgba(0,0,0,0.82) 100%)',
        overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(rgba(${accentColorRgb},0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(${accentColorRgb},0.03) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        transition: 'background-image 1s ease',
      }} />

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
          title={isMotocultores ? 'Titan PRO' : 'Bombas de alta precisión'}
          eyebrow={isMotocultores ? 'El Motocultor de Élite' : 'Tecnología de fumigación'}
          accentColor={accentColor}
          accentColorRgb={accentColorRgb}
          entered={entered}
        />

        {isMotocultores ? (
          /* Custom layout for Titan Pro Motocultor */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {/* Centered Product Title and Description */}
            <div style={{
              textAlign: 'center',
              maxWidth: '48rem',
              margin: '0 auto 1.5rem',
              opacity: entered ? 1 : 0,
              transform: entered ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.8s ease 0.1s, transform 0.8s ease 0.1s',
            }}>
              <h3 style={{
                fontSize: 'clamp(2rem, 4vw, 2.75rem)',
                fontWeight: 900,
                color: '#fff',
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                marginBottom: '1rem',
              }}>
                Titan PRO <span style={{ color: accentColor }}>TF1600AE</span>
              </h3>
              <p style={{
                fontSize: 'clamp(0.95rem, 1.2vw, 1.05rem)',
                color: 'rgba(255, 255, 255, 0.5)',
                lineHeight: 1.6,
                maxWidth: '42rem',
                margin: '0 auto',
              }}>
                El motocultor diésel más potente y robusto de Campomaq, diseñado específicamente para soportar largas jornadas de labranza y transporte en los exigentes terrenos de la agricultura ecuatoriana.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gap: '3rem',
                alignItems: 'center',
                opacity: entered ? 1 : 0,
                transform: entered ? 'translateY(0)' : 'translateY(40px)',
                transition: 'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s',
              }}
              className="grid grid-cols-1 lg:grid-cols-12"
            >
              {/* Left Column: Gallery */}
              <div
                onMouseEnter={() => setGalleryHovered(true)}
                onMouseLeave={() => setGalleryHovered(false)}
                style={{
                  position: 'sticky',
                  top: '9rem',
                  marginTop: '-5rem',
                  alignSelf: 'center',
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
                  border: `1px solid ${galleryHovered ? `rgba(${accentColorRgb}, 0.45)` : `rgba(${accentColorRgb}, 0.16)`}`,
                  borderRadius: '2rem',
                  padding: '1.5rem',
                  boxShadow: galleryHovered
                    ? `0 35px 75px rgba(0, 0, 0, 0.65), 0 0 45px rgba(${accentColorRgb}, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.08)`
                    : '0 25px 55px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.04)',
                  backdropFilter: 'blur(12px)',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                className="lg:col-span-6"
              >
              {/* Main Image View */}
              <div
                style={{
                  position: 'relative',
                  aspectRatio: '1/1',
                  background: 'transparent',
                  marginBottom: '1.25rem',
                }}
              >
                <Image
                  src={titanProImages[activeImageIndex]}
                  alt="Motocultor Titan Pro"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 500px"
                  style={{ 
                    objectFit: 'contain', 
                    padding: '1.5rem',
                    transition: 'all 0.5s ease' 
                  }}
                  priority
                />
                <div style={{
                  position: 'absolute', bottom: '1rem', right: '1rem',
                  background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
                  padding: '0.4rem 0.8rem', borderRadius: '9999px',
                  fontSize: '0.7rem', fontWeight: 700, color: accentColor,
                  border: `1px solid rgba(${accentColorRgb}, 0.3)`,
                  zIndex: 10,
                }}>
                  Foto {activeImageIndex + 1} de {titanProImages.length}
                </div>
              </div>

              {/* Thumbnails */}
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                {titanProImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    style={{
                      position: 'relative',
                      width: '80px',
                      height: '80px',
                      borderRadius: '0.75rem',
                      overflow: 'hidden',
                      border: idx === activeImageIndex 
                        ? `2px solid ${accentColor}` 
                        : '2px solid transparent',
                      background: 'rgba(255,255,255,0.02)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      outline: 'none',
                    }}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      style={{ 
                        objectFit: 'contain', 
                        padding: '0.35rem',
                        opacity: idx === activeImageIndex ? 1 : 0.6 
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Technical Sheet */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
              }}
              className="lg:col-span-6"
            >
              {/* Technical Specifications Sheet */}
              <div
                style={{
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '2rem',
                  padding: '1.75rem',
                  boxShadow: '0 20px 45px rgba(0,0,0,0.4)',
                  backdropFilter: 'blur(12px)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Glow ambiental dentro de la ficha */}
                <div style={{
                  position: 'absolute',
                  top: '-20%',
                  right: '-20%',
                  width: '60%',
                  aspectRatio: '1/1',
                  borderRadius: '50%',
                  background: `radial-gradient(circle, rgba(${accentColorRgb}, 0.05) 0%, transparent 70%)`,
                  pointerEvents: 'none',
                }} />

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  marginBottom: '1.75rem',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  letterSpacing: '0.18em',
                  color: accentColor,
                  textTransform: 'uppercase',
                }}>
                  <ShieldCheck size={18} />
                  Ficha Técnica Oficial
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                  {/* Category: Fuerza & Rendimiento */}
                  <div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.75rem',
                      paddingBottom: '0.35rem',
                      borderBottom: '1px solid rgba(255,255,255,0.08)',
                    }}>
                      <Zap size={14} style={{ color: accentColor }} />
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fff' }}>
                        Fuerza & Rendimiento
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      {titanProSpecs.filter(s => s.category === 'fuerza').map((item, idx) => (
                        <SpecRow key={idx} label={item.label} value={item.value} detail={item.detail} />
                      ))}
                    </div>
                  </div>

                  {/* Category: Sistema de Labranza */}
                  <div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.75rem',
                      paddingBottom: '0.35rem',
                      borderBottom: '1px solid rgba(255,255,255,0.08)',
                    }}>
                      <Settings size={14} style={{ color: accentColor }} />
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fff' }}>
                        Sistema de Labranza
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      {titanProSpecs.filter(s => s.category === 'operacion').map((item, idx) => (
                        <SpecRow key={idx} label={item.label} value={item.value} detail={item.detail} />
                      ))}
                    </div>
                  </div>

                  {/* Category: Capacidad & Soporte */}
                  <div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.75rem',
                      paddingBottom: '0.35rem',
                      borderBottom: '1px solid rgba(255,255,255,0.08)',
                    }}>
                      <Scale size={14} style={{ color: accentColor }} />
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fff' }}>
                        Capacidad & Soporte
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      {titanProSpecs.filter(s => s.category === 'soporte').map((item, idx) => (
                        <SpecRow key={idx} label={item.label} value={item.value} detail={item.detail} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* WhatsApp Call to Action Button */}
              <a
                href={wsppUrl}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setWsppHovered(true)}
                onMouseLeave={() => setWsppHovered(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  padding: '1.1rem 2rem',
                  borderRadius: '1rem',
                  background: wsppHovered ? '#22C55E' : buttonGradient,
                  color: wsppHovered ? '#fff' : '#000',
                  textShadow: wsppHovered ? '0 1px 2px rgba(0,0,0,0.2)' : 'none',
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: wsppHovered 
                    ? '0 15px 35px rgba(34, 197, 94, 0.4)' 
                    : `0 15px 35px rgba(${accentColorRgb}, 0.25)`,
                  textAlign: 'center',
                }}
              >
                <ShoppingBag size={18} />
                Contactar y Cotizar en WhatsApp
              </a>
            </div>
          </div>
        </div>
        ) : (
          /* Original Layout for Bombas */
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            perspective: '1200px',
          }}>
            {bombasData.map((product, i) => (
              <Product3DCard
                key={`bomba-${i}`}
                {...product}
                accentColor={accentColor}
                accentColorRgb={accentColorRgb}
                buttonGradient={buttonGradient}
                index={i}
                entered={entered}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
