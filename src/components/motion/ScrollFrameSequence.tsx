import React, { useRef } from 'react';
import { useScrollProgress } from '../../hooks/useScrollProgress';
import { useFramePreloader } from '../../hooks/useFramePreloader';
import { useCanvasRenderer } from '../../hooks/useCanvasRenderer';
import { mapProgressToFrameIndex } from '../../utils/frameSequence';
import { SectionLabel } from '../ui/SectionLabel';
import { TelemetryLabel } from '../ui/TelemetryLabel';

interface ScrollFrameSequenceProps {
  containerRef: React.RefObject<HTMLElement>;
}

export const ScrollFrameSequence: React.FC<ScrollFrameSequenceProps> = ({ containerRef }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 1. Scroll Progress Hook
  const progress = useScrollProgress(containerRef);

  // 2. Preloader Hook
  const { totalCount, isInitialReady, progressPercent, getFrame } = useFramePreloader({
    triggerRef: containerRef,
  });

  // 3. Choreographed Frame Index
  const targetFrameIndex = mapProgressToFrameIndex(progress, totalCount);
  const currentFrame = getFrame(targetFrameIndex);

  // 4. Canvas Renderer Hook
  useCanvasRenderer({
    canvasRef,
    currentFrame,
    frameIndex: targetFrameIndex,
  });

  // 5. Phase state calculations for overlay transitions
  const isAssembledEarly = progress <= 0.14;
  const isDisassembling = progress > 0.14 && progress < 0.48;
  const isExplodedHold = progress >= 0.48 && progress <= 0.67;
  const isReassembling = progress > 0.67 && progress < 0.90;
  const isAssembledFinal = progress >= 0.90;

  const componentsList = [
    { id: '01', title: 'OPTICAL STACK & COVER', desc: 'Hydrophobic scratch-resistant glass.' },
    { id: '02', title: '1/1.9" SENSOR ARCHITECTURE', desc: 'Versatile 8:7 and 16:9 capture.' },
    { id: '03', title: 'GP2 PROCESSOR', desc: 'Real-time stabilization engine.' },
    { id: '04', title: 'THERMAL FRAME', desc: 'High-load heat dissipation.' },
    { id: '05', title: 'ENDURO 1900MAH CELL', desc: 'Extended sub-zero power.' },
  ];

  return (
    <div
      className="engineering-sticky-stage"
      style={{
        position: 'sticky',
        top: 'var(--nav-height)',
        height: 'calc(100vh - var(--nav-height))',
        width: '100%',
        backgroundColor: '#050607',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Background Ambience */}
      <div className="lens-glow" style={{ top: '35%', left: '50%', transform: 'translateX(-50%)', width: '500px', height: '500px', opacity: isExplodedHold ? 0.35 : 0.2 }} />

      {/* HTML5 Render Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          display: 'block',
          zIndex: 1,
        }}
      />

      {/* Discreet Loader if initial frame is not yet ready */}
      {!isInitialReady && (
        <div
          style={{
            position: 'absolute',
            zIndex: 20,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 20px',
            backgroundColor: 'rgba(11, 13, 15, 0.85)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-default)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div
            style={{
              width: '14px',
              height: '14px',
              border: '2px solid var(--border-medium)',
              borderTopColor: 'var(--gopro-blue)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.12em' }}>
            ENGINEERING SYSTEM // LOADING {progressPercent}%
          </span>
        </div>
      )}

      {/* UI Overlay Container */}
      <div
        className="container"
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          paddingTop: '24px',
          paddingBottom: '32px',
          pointerEvents: 'none',
        }}
      >
        {/* Top Overlay Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <SectionLabel number="02" category="ARCHITECTURE" />
            <h2
              className="headline-lg"
              style={{
                marginTop: '4px',
                marginBottom: '4px',
                transition: 'opacity 0.25s ease',
              }}
            >
              {isExplodedHold
                ? 'SMALL BODY. SERIOUS ENGINEERING.'
                : isAssembledEarly
                ? 'SEALED INTEGRITY.'
                : isAssembledFinal
                ? 'INTEGRITY VERIFIED.'
                : isDisassembling
                ? 'DECONSTRUCTING ARCHITECTURE...'
                : 'REASSEMBLING SYSTEM...'}
            </h2>
            <p className="body-base" style={{ color: 'var(--text-secondary)', maxWidth: '480px' }}>
              {isExplodedHold
                ? 'Spatial component layout engineered for extreme vibration and thermal load.'
                : isAssembledEarly
                ? '10m (33ft) factory-sealed chassis built for demanding environments.'
                : isAssembledFinal
                ? 'Precision locked and ready for extreme action.'
                : 'Scroll to explore the internal component architecture.'}
            </p>
          </div>

          {/* Telemetry pill */}
          <div style={{ pointerEvents: 'auto' }}>
            {isExplodedHold ? (
              <TelemetryLabel label="NOTICE" value="CONCEPTUAL ENGINEERING VISUALIZATION" active />
            ) : (
              <TelemetryLabel
                label="CHASSIS"
                value={`PROGRESS: ${Math.round(progress * 100)}% // FRAME: ${targetFrameIndex + 1}/${totalCount}`}
                active={isExplodedHold || isDisassembling || isReassembling}
              />
            )}
          </div>
        </div>

        {/* Mid-stage Exploded Callout Grid (Visible only during 50% - 65% Exploded Hold) */}
        {isExplodedHold && (
          <div
            className="exploded-components-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '12px',
              width: '100%',
              maxWidth: '1080px',
              margin: '0 auto',
              pointerEvents: 'auto',
              animation: 'fadeIn 0.3s ease',
            }}
          >
            {componentsList.map((item) => (
              <div
                key={item.id}
                style={{
                  backgroundColor: 'rgba(11, 13, 15, 0.8)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-default)',
                  padding: '12px 14px',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--gopro-blue)', marginBottom: '2px' }}>
                  {item.id} // REGION
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.8125rem', color: 'var(--text-primary)', marginBottom: '2px' }}>
                  {item.title}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.3 }}>
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Overlay Info */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(34, 39, 46, 0.6)',
            paddingTop: '12px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6875rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.12em',
          }}
        >
          <span>CHASSIS TOLERANCE: ±0.02MM</span>
          <span>
            {isExplodedHold
              ? 'SCROLL DOWN TO REASSEMBLE ↓'
              : isAssembledFinal
              ? 'HANDOFF READY // SECTION RELEASE'
              : 'SCROLL TO SCRUB ENGINEERING SEQUENCE ↓'}
          </span>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 767px) {
          .exploded-components-grid {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};
