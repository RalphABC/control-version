"use client";

import Image from 'next/image';
import { Phone, MapPin, Mail, Clock, ShieldCheck, Facebook, Instagram, Youtube } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export const Footer = () => {
  const { accentColor, accentColorRgb } = useTheme();

  return (
    <footer
      style={{
        background: '#030303',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '5rem 2rem 2rem',
        position: 'relative',
        zIndex: 10,
        color: 'rgba(255, 255, 255, 0.6)',
      }}
    >
      <div
        style={{
          maxWidth: '72rem',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '3rem',
          marginBottom: '4rem',
        }}
      >
        {/* Column 1: Brand Info & Social Media */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ position: 'relative', width: '140px', height: '44px' }}>
            <Image
              src="/images/campo_maq_transparent.webp"
              alt="Logo Campomaq"
              fill
              sizes="(max-width: 768px) 140px, 280px"
              quality={95}
              style={{ objectFit: 'contain' }}
            />
          </div>
          <p style={{ fontSize: '0.82rem', lineHeight: 1.6 }}>
            Más de 20 años importando y distribuyendo la mejor maquinaria agrícola del Ecuador. Garantía oficial y respaldo técnico garantizado para el agricultor.
          </p>
          
          {/* Social Networks */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            {[
              { icon: <Facebook size={18} />, href: 'https://www.facebook.com/campomaq/', label: 'Facebook' },
              { icon: <Instagram size={18} />, href: 'https://www.instagram.com/campomaq/', label: 'Instagram' },
              { icon: <Youtube size={18} />, href: 'https://www.youtube.com/@campomaq9918', label: 'YouTube' },
            ].map((soc, i) => (
              <a
                key={i}
                href={soc.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visitar Campomaq en ${soc.label}`}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: 'rgba(255, 255, 255, 0.7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = accentColor;
                  e.currentTarget.style.color = '#000';
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.style.boxShadow = `0 0 15px rgba(${accentColorRgb}, 0.4)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {soc.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Column 2: Contact Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h4
            style={{
              fontSize: '0.85rem',
              fontWeight: 800,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#fff',
            }}
          >
            Matriz Cayambe
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', fontSize: '0.82rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'start' }}>
              <MapPin size={18} style={{ color: accentColor, flexShrink: 0, marginTop: '0.1rem' }} />
              <span>Calle Venezuela OE4-64 y Sergio Mejía (a pocos metros de gasolinera Primax), Cayambe, Ecuador.</span>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <Phone size={16} style={{ color: accentColor, flexShrink: 0 }} />
              <a href="tel:+59322110537" style={{ color: 'inherit', textDecoration: 'none' }} onMouseEnter={(e) => e.currentTarget.style.color = accentColor} onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}>(02) 2110 537</a>
              <span>/</span>
              <a href="tel:+593980582555" style={{ color: 'inherit', textDecoration: 'none' }} onMouseEnter={(e) => e.currentTarget.style.color = accentColor} onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}>098 058 2555</a>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <Mail size={16} style={{ color: accentColor, flexShrink: 0 }} />
              <a href="mailto:ventas@campomaq.com.ec" style={{ color: 'inherit', textDecoration: 'none' }} onMouseEnter={(e) => e.currentTarget.style.color = accentColor} onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}>ventas@campomaq.com.ec</a>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'start' }}>
              <Clock size={16} style={{ color: accentColor, flexShrink: 0, marginTop: '0.1rem' }} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span>Lun a Vie: 8:00 AM – 5:30 PM</span>
                <span>Sábados: 8:00 AM – 12:30 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: Authorized Badge & Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h4
            style={{
              fontSize: '0.85rem',
              fontWeight: 800,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#fff',
            }}
          >
            Soporte & Garantía
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.82rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                fontSize: '0.82rem',
                color: accentColor,
                fontWeight: 700,
              }}
            >
              <ShieldCheck size={18} />
              Distribuidor Autorizado
            </div>
            <p style={{ lineHeight: 1.5 }}>
              Contamos con un equipo de ingenieros capacitados y un stock de repuestos permanentes para garantizar que tu motocultor Titan PRO nunca detenga su trabajo en el campo.
            </p>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          paddingTop: '2rem',
          paddingBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.75rem',
        }}
      >
        <span style={{ minWidth: 0, wordBreak: 'break-word' }}>© {new Date().getFullYear()} Campomaq. Todos los derechos reservados.</span>
        <span style={{ minWidth: 0, wordBreak: 'break-word' }}>Garantizamos nuestro servicio | Cayambe - Ecuador</span>
      </div>
    </footer>
  );
};
