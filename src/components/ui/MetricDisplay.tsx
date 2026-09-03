import React from 'react';

interface MetricDisplayProps {
  value: string;
  unit?: string;
  label?: string;
  subtext?: string;
  accent?: boolean;
  size?: 'normal' | 'giant';
  className?: string;
}

export const MetricDisplay: React.FC<MetricDisplayProps> = ({
  value,
  unit,
  label,
  subtext,
  accent = false,
  size = 'normal',
  className = '',
}) => {
  return (
    <div className={`metric-display-block ${className}`} style={{ display: 'flex', flexDirection: 'column' }}>
      {label && (
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6875rem',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            marginBottom: '6px',
          }}
        >
          {label}
        </span>
      )}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span
          className={size === 'giant' ? 'display-giant' : 'display-hero'}
          style={{
            color: accent ? 'var(--gopro-blue)' : 'var(--text-primary)',
            textShadow: accent ? '0 0 30px var(--gopro-blue-glow)' : 'none',
          }}
        >
          {value}
        </span>
        {unit && (
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: size === 'giant' ? 'clamp(1.5rem, 3vw, 3rem)' : 'clamp(1.25rem, 2vw, 2rem)',
              fontWeight: 700,
              color: 'var(--gopro-blue)',
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
            }}
          >
            {unit}
          </span>
        )}
      </div>
      {subtext && (
        <span
          style={{
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
            marginTop: '6px',
            maxWidth: '320px',
            lineHeight: 1.4,
          }}
        >
          {subtext}
        </span>
      )}
    </div>
  );
};
