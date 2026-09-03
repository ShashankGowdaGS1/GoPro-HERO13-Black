import { useEffect, useRef, RefObject } from 'react';

interface UseCanvasRendererProps {
  canvasRef: RefObject<HTMLCanvasElement>;
  currentFrame: HTMLImageElement | null;
  frameIndex: number;
}

export function useCanvasRenderer({ canvasRef, currentFrame, frameIndex }: UseCanvasRendererProps) {
  const lastRenderedIndexRef = useRef<number>(-1);
  const lastRenderedFrameRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let rafId: number | null = null;

    const render = () => {
      if (!currentFrame) return;

      // Dirty checking: skip if same frame and same dimensions
      if (
        lastRenderedIndexRef.current === frameIndex &&
        lastRenderedFrameRef.current === currentFrame
      ) {
        return;
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;

      const targetWidth = Math.round(displayWidth * dpr);
      const targetHeight = Math.round(displayHeight * dpr);

      if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
      }

      // Background clear in obsidian void
      ctx.fillStyle = '#050607';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Contain-fit calculation
      const imgWidth = currentFrame.naturalWidth || currentFrame.width || 1600;
      const imgHeight = currentFrame.naturalHeight || currentFrame.height || 900;

      const scale = Math.min(canvas.width / imgWidth, canvas.height / imgHeight);
      const drawWidth = imgWidth * scale;
      const drawHeight = imgHeight * scale;
      const dx = (canvas.width - drawWidth) / 2;
      const dy = (canvas.height - drawHeight) / 2;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(currentFrame, dx, dy, drawWidth, drawHeight);

      lastRenderedIndexRef.current = frameIndex;
      lastRenderedFrameRef.current = currentFrame;
    };

    rafId = requestAnimationFrame(render);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [canvasRef, currentFrame, frameIndex]);

  // Window resize observer to invalidate cache
  useEffect(() => {
    const handleResize = () => {
      lastRenderedIndexRef.current = -1;
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);
}
