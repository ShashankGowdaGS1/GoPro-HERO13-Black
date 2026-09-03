import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'text' | 'gopro';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'right',
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontFamily: 'var(--font-mono)',
    fontSize: size === 'sm' ? '0.75rem' : size === 'lg' ? '0.875rem' : '0.8125rem',
    fontWeight: 600,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    borderRadius: 'var(--radius-default)',
    cursor: props.disabled ? 'not-allowed' : 'pointer',
    transition: 'all var(--transition-default)',
    textDecoration: 'none',
    width: fullWidth ? '100%' : 'auto',
    opacity: props.disabled ? 0.5 : 1,
    padding: size === 'sm' ? '8px 16px' : size === 'lg' ? '14px 28px' : '10px 20px',
  };

  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: 'var(--bg-raised)',
          color: 'var(--text-primary)',
          border: '1px solid var(--gopro-blue)',
          boxShadow: '0 0 14px var(--gopro-blue-glow)',
        };
      case 'gopro':
        return {
          backgroundColor: 'var(--gopro-blue)',
          color: '#000000',
          border: '1px solid var(--gopro-blue)',
          fontWeight: 700,
        };
      case 'secondary':
        return {
          backgroundColor: 'transparent',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-medium)',
        };
      case 'text':
        return {
          backgroundColor: 'transparent',
          color: 'var(--text-secondary)',
          border: '1px solid transparent',
          padding: '6px 12px',
        };
      default:
        return {};
    }
  };

  return (
    <button
      style={{ ...baseStyles, ...getVariantStyles() }}
      className={`btn-interactive ${className}`}
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <span className="material-symbols-outlined" style={{ fontSize: '1.1em' }} aria-hidden="true">
          {icon}
        </span>
      )}
      <span>{children}</span>
      {icon && iconPosition === 'right' && (
        <span className="material-symbols-outlined" style={{ fontSize: '1.1em' }} aria-hidden="true">
          {icon}
        </span>
      )}
    </button>
  );
};
