import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer
      style={{
        backgroundColor: 'var(--bg-canvas)',
        borderTop: '1px solid var(--border-subtle)',
        padding: '32px 0',
        width: '100%',
        color: 'var(--text-muted)',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          letterSpacing: '0.1em',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>GoPro</span>
          <span>//</span>
          <span>HERO13 BLACK © 2026</span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
          <a href="#hero" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Overview</a>
          <a href="#engineering" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Architecture</a>
          <a href="#performance" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Performance</a>
          <a href="#lenses" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Lenses</a>
          <a href="#stabilization" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Stabilization</a>
          <a href="#durability" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Durability</a>
          <a href="#power" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Power</a>
        </div>

        <div style={{ color: 'var(--text-dim)', fontSize: '0.6875rem' }}>
          CONCEPTUAL PRODUCT VISUALIZATION
        </div>
      </div>
    </footer>
  );
};
