import React from 'react';

interface TechnicalDividerProps {
  label?: string;
  className?: string;
}

export const TechnicalDivider: React.FC<TechnicalDividerProps> = ({ label, className = '' }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        width: '100%',
        margin: '32px 0',
      }}
      className={className}
    >
      <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-subtle)' }} />
      {label && (
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.625rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
          }}
        >
          {label}
        </span>
      )}
      <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-subtle)' }} />
    </div>
  );
};
