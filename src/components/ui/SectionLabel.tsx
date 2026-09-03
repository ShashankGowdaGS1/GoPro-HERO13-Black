import React from 'react';

interface SectionLabelProps {
  number: string;
  category: string;
  className?: string;
}

export const SectionLabel: React.FC<SectionLabelProps> = ({ number, category, className = '' }) => {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.75rem',
        fontWeight: 600,
        letterSpacing: '0.16em',
        color: 'var(--gopro-blue)',
        textTransform: 'uppercase',
        marginBottom: '12px',
      }}
      className={className}
    >
      <span style={{ color: 'var(--text-muted)' }}>[</span>
      <span>{number}</span>
      <span style={{ color: 'var(--text-dim)' }}>//</span>
      <span>{category}</span>
      <span style={{ color: 'var(--text-muted)' }}>]</span>
    </div>
  );
};
