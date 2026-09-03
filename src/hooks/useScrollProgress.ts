import { useState, useEffect, RefObject } from 'react';
import { clamp } from '../utils/frameSequence';

export function useScrollProgress(containerRef: RefObject<HTMLElement>): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let rafId: number | null = null;

    const calculateProgress = () => {
      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const totalScrollable = rect.height - viewportHeight;

      if (totalScrollable <= 0) {
        setProgress(0);
        return;
      }

      // rect.top is the distance from the top of the viewport to the top of the element.
      // When rect.top is 0, we are at 0% scroll of this container.
      // When rect.top is -totalScrollable, we are at 100% scroll of this container.
      const currentScroll = -rect.top;
      const normalized = clamp(currentScroll / totalScrollable, 0, 1);

      setProgress((prev) => {
        // Only update if difference is noticeable to avoid excessive React renders
        if (Math.abs(prev - normalized) > 0.0005) {
          return normalized;
        }
        return prev;
      });
    };

    const onScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        calculateProgress();
        rafId = null;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    calculateProgress();

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [containerRef]);

  return progress;
}
