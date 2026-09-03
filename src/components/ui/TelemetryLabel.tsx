import React from 'react';

interface TelemetryLabelProps {
  label: string;
  value?: string;
  active?: boolean;
  icon?: string;
  className?: string;
}

export const TelemetryLabel: React.FC<TelemetryLabelProps> = ({
  label,
  value,
  active = false,
  icon,
  className = '',
}) => {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 12px',
        backgroundColor: 'var(--bg-raised)',
        border: active ? '1px solid var(--gopro-blue)' : '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-default)',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.6875rem',
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
        boxShadow: active ? '0 0 10px var(--gopro-blue-glow)' : 'none',
      }}
      className={className}
    >
      {icon && (
        <span
          className="material-symbols-outlined"
          style={{ fontSize: '1rem', color: active ? 'var(--gopro-blue)' : 'var(--text-muted)' }}
          aria-hidden="true"
        >
          {icon}
        </span>
      )}
      <span style={{ color: 'var(--text-muted)' }}>{label}</span>
      {value && (
        <>
          <span style={{ color: 'var(--text-dim)' }}>:</span>
          <span style={{ color: active ? 'var(--gopro-blue)' : 'var(--text-primary)', fontWeight: 600 }}>
            {value}
          </span>
        </>
      )}
    </div>
  );
};
