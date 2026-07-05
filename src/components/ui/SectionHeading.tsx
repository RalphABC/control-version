interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  accentColor: string;
  accentColorRgb: string;
  entered: boolean;
}

export const SectionHeading = ({ eyebrow, title, accentColor, accentColorRgb, entered }: SectionHeadingProps) => (
  <div style={{
    textAlign: 'center',
    marginBottom: '4rem',
    opacity: entered ? 1 : 0,
    transform: entered ? 'translateY(0)' : 'translateY(40px)',
    transition: 'opacity 0.8s ease, transform 0.8s ease',
  }}>
    <div style={{
      display: 'inline-block',
      fontSize: '0.62rem', letterSpacing: '0.4em',
      color: accentColor, fontWeight: 700,
      textTransform: 'uppercase',
      marginBottom: '1rem',
      textShadow: `0 0 20px rgba(${accentColorRgb},0.4)`,
    }}>
      {eyebrow}
    </div>
    <h2 style={{
      fontSize: 'clamp(2rem, 5vw, 3.8rem)',
      fontWeight: 900, letterSpacing: '-0.03em',
      color: '#fff', lineHeight: 1,
    }}>
      {title}
    </h2>
  </div>
);
