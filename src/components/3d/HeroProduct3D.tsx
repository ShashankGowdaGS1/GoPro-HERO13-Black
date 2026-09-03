import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface HeroProduct3DProps {
  fallbackImage?: string;
}

export const HeroProduct3D: React.FC<HeroProduct3DProps> = ({
  fallbackImage = '/assets/product/hero-camera.png',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);
  const [isDraggingState, setIsDraggingState] = useState<boolean>(false);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // Check WebGL availability
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setHasError(true);
        return;
      }
    } catch {
      setHasError(true);
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(isTouch);

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 500;
    const aspect = width / height;

    const camera = new THREE.PerspectiveCamera(38, aspect, 0.1, 100);
    camera.position.set(0, 0, 4.2);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });

    const dpr = Math.min(window.devicePixelRatio || 1, isTouch ? 1.5 : 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    // 2. 360-Degree Balanced Studio Lighting Rig (No dark silhouettes from any angle)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.6);
    scene.add(ambientLight);

    // Front-Right Key
    const frontKey = new THREE.DirectionalLight(0xffffff, 2.4);
    frontKey.position.set(3.2, 3.8, 4.0);
    scene.add(frontKey);

    // Front-Left Fill
    const frontFill = new THREE.DirectionalLight(0xd5e6f3, 1.5);
    frontFill.position.set(-3.5, 2.2, 3.2);
    scene.add(frontFill);

    // Rear Key (Illuminates back display when camera rotates 180°)
    const rearKey = new THREE.DirectionalLight(0xffffff, 2.2);
    rearKey.position.set(2.0, 3.2, -4.5);
    scene.add(rearKey);

    // Rear-Left Cyan Rim Highlight
    const rearCyanRim = new THREE.DirectionalLight(0x00aeef, 2.6);
    rearCyanRim.position.set(-3.8, 2.8, -3.8);
    scene.add(rearCyanRim);

    // Right Edge Highlight
    const rightEdgeLight = new THREE.DirectionalLight(0xa5c4db, 1.8);
    rightEdgeLight.position.set(4.2, 1.5, 0.0);
    scene.add(rightEdgeLight);

    // Bottom Ambient Edge Bounce
    const bottomGlow = new THREE.PointLight(0x00aeef, 1.2, 10);
    bottomGlow.position.set(0, -2.5, 0);
    scene.add(bottomGlow);

    // 3. Load Model Group
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    // Approved neutral orientation: 3-quarter view showing front display, lens, and 13 BLACK
    const BASE_ROT_Y = -0.42; // ~ -24 degrees
    const BASE_ROT_X = 0.08; // ~ 4.5 degrees
    const BASE_ROT_Z = -0.02;

    modelGroup.rotation.set(BASE_ROT_X, BASE_ROT_Y, BASE_ROT_Z);

    let isModelReady = false;

    // 4. Model Loading with Scale Enhancement (+13.3% visual volume)
    const loader = new GLTFLoader();
    loader.load(
      '/assets/models/hero13-black.glb',
      (gltf) => {
        const model = gltf.scene;

        // Center and normalize model geometry
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        const maxDim = Math.max(size.x, size.y, size.z);
        // Scale increased from 2.4 to 2.72 for major Hero presence
        const scaleFactor = 2.72 / (maxDim || 1);

        model.position.x = -center.x * scaleFactor;
        model.position.y = -center.y * scaleFactor;
        model.position.z = -center.z * scaleFactor;
        model.scale.set(scaleFactor, scaleFactor, scaleFactor);

        // Enhance material reflectivity for studio look
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            if (mesh.material) {
              const mat = mesh.material as THREE.MeshStandardMaterial;
              mat.roughness = Math.max(0.18, mat.roughness ?? 0.3);
              mat.metalness = Math.min(0.85, mat.metalness ?? 0.4);
              mat.envMapIntensity = 1.25;
            }
          }
        });

        modelGroup.add(model);
        isModelReady = true;
        setIsLoaded(true);
      },
      undefined,
      (err) => {
        console.warn('Hero 3D GLB model loading failed, using fallback image', err);
        setHasError(true);
      }
    );

    // 5. Interaction State Refs (No React re-renders during mouse moves/dragging)
    const interaction = {
      isDragging: false,
      hasInteracted: false,
      lastPointerX: 0,
      lastPointerY: 0,
      manualYaw: BASE_ROT_Y,
      manualPitch: BASE_ROT_X,
      targetManualYaw: BASE_ROT_Y,
      targetManualPitch: BASE_ROT_X,
      // Passive cursor parallax
      cursorX: 0,
      cursorY: 0,
      targetCursorX: 0,
      targetCursorY: 0,
      // Double-click smooth reset state
      isResetting: false,
      resetStartTime: 0,
      resetDuration: 750,
      resetStartYaw: BASE_ROT_Y,
      resetStartPitch: BASE_ROT_X,
    };

    // 6. Pointer Event Handlers
    const onPointerDown = (e: PointerEvent) => {
      // Only primary mouse button or single touch
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      interaction.isDragging = true;
      setIsDraggingState(true);
      interaction.lastPointerX = e.clientX;
      interaction.lastPointerY = e.clientY;
      interaction.isResetting = false;

      if (!interaction.hasInteracted) {
        interaction.hasInteracted = true;
        setHasInteracted(true);
      }

      if (canvas.setPointerCapture) {
        try {
          canvas.setPointerCapture(e.pointerId);
        } catch {}
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (interaction.isDragging) {
        const deltaX = e.clientX - interaction.lastPointerX;
        const deltaY = e.clientY - interaction.lastPointerY;
        interaction.lastPointerX = e.clientX;
        interaction.lastPointerY = e.clientY;

        // Horizontal sensitivity: ~0.0078 rad/px (unbounded full 360/720 rotation)
        interaction.targetManualYaw += deltaX * 0.0078;

        // Vertical sensitivity: pitch clamped to ±15 degrees (±0.26 rad)
        if (!isTouch) {
          interaction.targetManualPitch -= deltaY * 0.005;
          interaction.targetManualPitch = Math.max(-0.26, Math.min(0.26, interaction.targetManualPitch));
        }
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      if (interaction.isDragging) {
        interaction.isDragging = false;
        setIsDraggingState(false);
        if (canvas.releasePointerCapture) {
          try {
            canvas.releasePointerCapture(e.pointerId);
          } catch {}
        }
      }
    };

    // Double-click smooth reset
    const onDoubleClick = () => {
      interaction.isResetting = true;
      interaction.resetStartTime = performance.now();
      interaction.resetStartYaw = interaction.targetManualYaw;
      interaction.resetStartPitch = interaction.targetManualPitch;
      interaction.isDragging = false;
      setIsDraggingState(false);
    };

    // Passive Cursor Parallax (relative to hero bounds when not dragging)
    const onMouseMove = (e: MouseEvent) => {
      if (isTouch || prefersReducedMotion || interaction.isDragging) return;
      const heroSection = document.getElementById('hero');
      if (!heroSection) return;

      const rect = heroSection.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;

      interaction.targetCursorX = Math.max(-1, Math.min(1, nx));
      interaction.targetCursorY = Math.max(-1, Math.min(1, ny));
    };

    const onMouseLeave = () => {
      interaction.targetCursorX = 0;
      interaction.targetCursorY = 0;
    };

    // Register Pointer and Window Listeners
    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
    canvas.addEventListener('dblclick', onDoubleClick);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);

    // 7. Entrance, Physics & Render Loop
    let animId: number;
    const startTime = performance.now();

    const PASSIVE_MAX_YAW = (4 * Math.PI) / 180; // ±4 degrees max passive tilt
    const PASSIVE_MAX_PITCH = (3 * Math.PI) / 180; // ±3 degrees max passive tilt
    const PASSIVE_POS_X = 0.12;
    const PASSIVE_POS_Y = 0.08;

    const render = (now: number) => {
      animId = requestAnimationFrame(render);

      const elapsed = (now - startTime) / 1000;

      // 1. Entrance animation progression (0 -> 1 over 1.4s)
      let entranceProgress = 1.0;
      if (!prefersReducedMotion && elapsed < 1.4) {
        const t = Math.min(elapsed / 1.4, 1.0);
        entranceProgress = 1 - Math.pow(1 - t, 3); // Cubic ease-out
      }

      // 2. Handle double-click smooth reset
      if (interaction.isResetting) {
        const resetElapsed = now - interaction.resetStartTime;
        const progress = Math.min(resetElapsed / interaction.resetDuration, 1.0);
        const eased = 1 - Math.pow(1 - progress, 3); // Ease-out

        interaction.targetManualYaw =
          interaction.resetStartYaw + (BASE_ROT_Y - interaction.resetStartYaw) * eased;
        interaction.targetManualPitch =
          interaction.resetStartPitch + (BASE_ROT_X - interaction.resetStartPitch) * eased;

        if (progress >= 1.0) {
          interaction.isResetting = false;
        }
      }

      // 3. Damped manual yaw & pitch interpolation
      interaction.manualYaw += (interaction.targetManualYaw - interaction.manualYaw) * 0.12;
      interaction.manualPitch += (interaction.targetManualPitch - interaction.manualPitch) * 0.12;

      // 4. Smooth damped passive cursor parallax
      interaction.cursorX += (interaction.targetCursorX - interaction.cursorX) * 0.06;
      interaction.cursorY += (interaction.targetCursorY - interaction.cursorY) * 0.06;

      // 5. Idle breathing (rotation disabled after user interaction to avoid fighting user)
      const idleRotY =
        prefersReducedMotion || interaction.hasInteracted ? 0 : Math.sin(elapsed * 0.8) * 0.009;
      const idlePosY = prefersReducedMotion ? 0 : Math.cos(elapsed * 0.6) * 0.02;

      if (isModelReady) {
        // Entrance scaling & elevation
        const startScale = 0.88;
        const currentScale = startScale + (1.0 - startScale) * entranceProgress;
        modelGroup.scale.set(currentScale, currentScale, currentScale);

        const entrancePosY = (1 - entranceProgress) * -0.3;

        // Passive cursor offsets are applied relative to user's selected manual orientation
        const passiveYaw = interaction.isDragging ? 0 : interaction.cursorX * PASSIVE_MAX_YAW;
        const passivePitch = interaction.isDragging ? 0 : -interaction.cursorY * PASSIVE_MAX_PITCH;

        modelGroup.rotation.y = interaction.manualYaw + passiveYaw + idleRotY;
        modelGroup.rotation.x = interaction.manualPitch + passivePitch;
        modelGroup.rotation.z = BASE_ROT_Z + (interaction.isDragging ? 0 : interaction.cursorX * 0.01);

        modelGroup.position.x = interaction.isDragging ? 0 : interaction.cursorX * PASSIVE_POS_X;
        modelGroup.position.y =
          entrancePosY + (interaction.isDragging ? 0 : -interaction.cursorY * PASSIVE_POS_Y) + idlePosY;

        // Dynamic specular highlight shifts with rotation
        frontKey.position.x = 3.2 + Math.sin(interaction.manualYaw) * 1.5;
        frontKey.position.z = 4.0 + Math.cos(interaction.manualYaw) * 1.5;
      }

      renderer.render(scene, camera);
    };

    animId = requestAnimationFrame(render);

    // 8. Resize Observer
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || 600;
      const h = container.clientHeight || 500;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', onResize, { passive: true });

    // Cleanup
    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      canvas.removeEventListener('dblclick', onDoubleClick);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('resize', onResize);

      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh;
          mesh.geometry.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m) => m.dispose());
          } else {
            mesh.material.dispose();
          }
        }
      });
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '460px',
        maxHeight: '68vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Fallback & Loading Poster Image (Fades out when 3D is ready) */}
      <img
        src={fallbackImage}
        alt="GoPro HERO13 Black Studio View"
        style={{
          position: 'absolute',
          width: '100%',
          maxWidth: '700px',
          maxHeight: '64vh',
          objectFit: 'contain',
          filter: 'drop-shadow(0 20px 50px rgba(0, 174, 239, 0.15)) drop-shadow(0 30px 60px rgba(0, 0, 0, 0.9))',
          opacity: isLoaded && !hasError ? 0 : 1,
          transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* 3D WebGL Canvas with Active Touch and Grab Controls */}
      {!hasError && (
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            display: 'block',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            filter: 'drop-shadow(0 20px 50px rgba(0, 174, 239, 0.12)) drop-shadow(0 30px 60px rgba(0, 0, 0, 0.85))',
            cursor: isDraggingState ? 'grabbing' : 'grab',
            touchAction: 'pan-y', // Allows natural vertical page scroll on mobile
            zIndex: 2,
          }}
        />
      )}

      {/* Restrained Technical Hint Badge */}
      {isLoaded && !hasError && (
        <div
          style={{
            position: 'absolute',
            bottom: '8px',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            backgroundColor: 'rgba(11, 13, 15, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: 'var(--radius-default)',
            backdropFilter: 'blur(8px)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6875rem',
            letterSpacing: '0.12em',
            color: 'var(--text-muted)',
            opacity: hasInteracted ? 0.35 : 0.85,
            transition: 'opacity 0.5s ease',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '0.9375rem', color: 'var(--gopro-blue)' }}>
            360
          </span>
          <span>{isTouchDevice ? 'SWIPE // 360° VIEW' : 'DRAG TO ROTATE // 360°'}</span>
        </div>
      )}
    </div>
  );
};
