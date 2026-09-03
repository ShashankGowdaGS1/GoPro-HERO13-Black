import React, { useRef, useState, useEffect } from 'react';
import { ScrollFrameSequence } from '../motion/ScrollFrameSequence';
import { SectionLabel } from '../ui/SectionLabel';
import { TechnicalDivider } from '../ui/TechnicalDivider';

export const EngineeringSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [staticTab, setStaticTab] = useState<'assembled' | 'exploded'>('assembled');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const onChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', onChange);
    return () => mediaQuery.removeEventListener('change', onChange);
  }, []);

  // Reduced-motion accessible fallback presentation
  if (prefersReducedMotion) {
    return (
      <section
        id="engineering"
        className="section-stage bg-tactical-grid"
        style={{
          backgroundColor: 'var(--bg-canvas)',
          position: 'relative',
        }}
      >
        <div className="container" style={{ zIndex: 10 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '32px' }}>
            <SectionLabel number="02" category="ARCHITECTURE" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h2 className="headline-lg" style={{ marginBottom: '8px' }}>
                  {staticTab === 'assembled' ? 'SEALED INTEGRITY.' : 'SMALL BODY. SERIOUS ENGINEERING.'}
                </h2>
                <p className="body-large" style={{ maxWidth: '600px' }}>
                  {staticTab === 'assembled'
                    ? '10m (33ft) factory-sealed waterproof housing built for demanding environments.'
                    : 'An unyielding spatial architecture engineered for extreme vibration and thermal load.'}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px', backgroundColor: 'var(--bg-surface)', padding: '4px', borderRadius: 'var(--radius-default)', border: '1px solid var(--border-subtle)' }}>
                <button
                  onClick={() => setStaticTab('assembled')}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    letterSpacing: '0.12em',
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: staticTab === 'assembled' ? 'var(--bg-raised)' : 'transparent',
                    color: staticTab === 'assembled' ? 'var(--gopro-blue)' : 'var(--text-muted)',
                    fontWeight: staticTab === 'assembled' ? 700 : 500,
                  }}
                >
                  01 // ASSEMBLED
                </button>
                <button
                  onClick={() => setStaticTab('exploded')}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    letterSpacing: '0.12em',
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: staticTab === 'exploded' ? 'var(--bg-raised)' : 'transparent',
                    color: staticTab === 'exploded' ? 'var(--gopro-blue)' : 'var(--text-muted)',
                    fontWeight: staticTab === 'exploded' ? 700 : 500,
                  }}
                >
                  02 // EXPLODED
                </button>
              </div>
            </div>
          </div>

          <div
            style={{
              position: 'relative',
              width: '100%',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: 'clamp(1.5rem, 4vw, 3rem)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '480px',
            }}
          >
            <img
              src={
                staticTab === 'assembled'
                  ? '/assets/product/engineering-assembled.png'
                  : '/assets/product/engineering-exploded.png'
              }
              alt={staticTab === 'assembled' ? 'GoPro HERO13 Assembled View' : 'GoPro HERO13 Exploded View'}
              style={{
                width: '100%',
                maxWidth: staticTab === 'assembled' ? '650px' : '900px',
                maxHeight: '52vh',
                objectFit: 'contain',
              }}
            />
          </div>

          <TechnicalDivider label="ACCESSIBLE STATIC ARCHITECTURE" />
        </div>
      </section>
    );
  }

  // Full Cinematic Scroll Sequence
  return (
    <section
      id="engineering"
      ref={sectionRef}
      className="engineering-scroll-container"
      style={{
        position: 'relative',
        backgroundColor: '#050607',
        width: '100%',
      }}
    >
      <ScrollFrameSequence containerRef={sectionRef} />

      <style>{`
        .engineering-scroll-container {
          height: 480vh;
        }
        @media (max-width: 1024px) {
          .engineering-scroll-container {
            height: 340vh;
          }
        }
        @media (max-width: 767px) {
          .engineering-scroll-container {
            height: 240vh;
          }
        }
      `}</style>
    </section>
  );
};
