"use client";

import { useState, type ComponentType, type CSSProperties } from 'react';
import { Shield, Cpu, Truck, Headset } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { SectionHeading } from '@/components/ui/SectionHeading';

interface FeatureItem {
  icon: ComponentType<{ size?: number; style?: CSSProperties }>;
  title: string;
  desc: string;
}

const content: Record<'motocultores' | 'bombas', { eyebrow: string; title: string; items: FeatureItem[] }> = {
  motocultores: {
    eyebrow: 'Ingeniería confiable',
    title: 'Construido para durar',
    items: [
      { icon: Shield, title: 'Construcción robusta', desc: 'Chasis y componentes reforzados que resisten terrenos exigentes, jornada tras jornada.' },
      { icon: Cpu, title: 'Motores eficientes', desc: 'Alto rendimiento con bajo consumo de combustible, pensados para el trabajo diario.' },
      { icon: Truck, title: 'Envío a todo el Ecuador', desc: 'Logística propia y seguimiento de tu pedido hasta la puerta de tu finca.' },
      { icon: Headset, title: 'Soporte y garantía', desc: 'Asesoría técnica, repuestos disponibles y garantía oficial en cada equipo.' },
    ],
  },
  bombas: {
    eyebrow: 'Tecnología de aplicación',
    title: 'Precisión que se nota',
    items: [
      { icon: Shield, title: 'Materiales resistentes', desc: 'Tanques y componentes preparados para agroquímicos y uso intensivo.' },
      { icon: Cpu, title: 'Presión constante', desc: 'Cobertura uniforme en cada pasada, con el mínimo desperdicio de producto.' },
      { icon: Truck, title: 'Envío a todo el Ecuador', desc: 'Logística propia y seguimiento de tu pedido hasta la puerta de tu finca.' },
      { icon: Headset, title: 'Soporte y garantía', desc: 'Asesoría técnica, repuestos disponibles y garantía oficial en cada equipo.' },
    ],
  },
};

const FeatureCard = ({ icon: Icon, title, desc, accentColor, accentColorRgb, entered, index }: FeatureItem & {
  accentColor: string; accentColorRgb: string; entered: boolean; index: number;
}) => {
  const [hovered, setHovered] = useState(false);
  const delay = index * 0.1;

  return (
    <div style={{
      opacity: entered ? 1 : 0,
      transform: entered ? 'translateY(0)' : 'translateY(40px)',
      transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
    }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          height: '100%',
          padding: '2rem 1.75rem',
          borderRadius: '1.25rem',
          background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.015) 100%)',
          border: `1px solid rgba(${accentColorRgb}, ${hovered ? 0.35 : 0.1})`,
          boxShadow: hovered
            ? `0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(${accentColorRgb},0.12)`
            : '0 8px 30px rgba(0,0,0,0.3)',
          transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
          transition: 'transform 0.4s cubic-bezier(0.34,1.2,0.64,1), border-color 0.4s ease, box-shadow 0.4s ease',
        }}
      >
        <div style={{
          width: 52, height: 52, borderRadius: '1rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: `rgba(${accentColorRgb},0.12)`,
          border: `1px solid rgba(${accentColorRgb},0.25)`,
          marginBottom: '1.5rem',
          transition: 'background 0.6s ease, border-color 0.6s ease',
        }}>
          <Icon size={24} style={{ color: accentColor }} />
        </div>
        <h3 style={{
          fontSize: '1.1rem', fontWeight: 800, color: '#fff',
          marginBottom: '0.6rem', letterSpacing: '-0.01em',
        }}>
          {title}
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }}>
          {desc}
        </p>
      </div>
    </div>
  );
};

export const Features = () => {
  const { isMotocultores, accentColor, accentColorRgb } = useTheme();
  const { ref, entered } = useScrollReveal<HTMLDivElement>(0.1);

  const c = isMotocultores ? content.motocultores : content.bombas;

  return (
    <section
      id="caracteristicas"
      style={{
        position: 'relative',
        padding: '8rem 1.5rem',
        background: '#000',
        overflow: 'hidden',
      }}
    >
      {/* Center glow */}
      <div style={{
        position: 'absolute', top: '0%', left: '50%',
        transform: 'translate(-50%,-50%)',
        width: 900, height: 500,
        borderRadius: '50%',
        background: `radial-gradient(ellipse, rgba(${accentColorRgb},0.06) 0%, transparent 70%)`,
        pointerEvents: 'none',
        transition: 'background 1s ease',
      }} />

      <div ref={ref} style={{ position: 'relative', maxWidth: '72rem', margin: '0 auto' }}>
        <SectionHeading
          eyebrow={c.eyebrow}
          title={c.title}
          accentColor={accentColor}
          accentColorRgb={accentColorRgb}
          entered={entered}
        />

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.5rem',
        }}>
          {c.items.map((item, i) => (
            <FeatureCard
              key={item.title}
              {...item}
              accentColor={accentColor}
              accentColorRgb={accentColorRgb}
              entered={entered}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
