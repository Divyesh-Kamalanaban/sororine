'use client';

import { useEffect, useRef } from 'react';

interface EnhancedGlobeProps {
  scrollProgress?: number;
}

export default function EnhancedGlobe({ scrollProgress = 0 }: EnhancedGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef(scrollProgress);
  const isInitializedRef = useRef(false);

  // Sync scrollProgress prop to ref for use in animation loop
  useEffect(() => {
    scrollProgressRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    if (!containerRef.current || isInitializedRef.current) return;

    let isMounted = true;
    isInitializedRef.current = true;
    let animationId: number | null = null;
    let renderer: any = null;
    let camera: any = null;

    const handleResize = () => {
      if (!renderer || !camera) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    const initGlobe = async () => {
      try {
        const THREE = (await import('three')) as any;

        if (!isMounted || !containerRef.current) return;

        // Scene setup
        const scene = new THREE.Scene();
        scene.background = null;

        // Lower FOV (45) + Further back (500) reduces perspective distortion at the edges
        camera = new THREE.PerspectiveCamera(
          45,
          window.innerWidth / window.innerHeight,
          0.1,
          10000
        );
        camera.position.set(0, 0, 500);

        // Lighting - High Intensity + Color Accents for Dark Mode
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
        scene.add(ambientLight);

        const sunLight = new THREE.DirectionalLight(0xffffff, 2.5);
        sunLight.position.set(200, 100, 100);
        scene.add(sunLight);

        const blueRimLight = new THREE.DirectionalLight(0x4488ff, 2.0);
        blueRimLight.position.set(-200, -100, -100);
        scene.add(blueRimLight);

        // Renderer
        renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.outputColorSpace = THREE.SRGBColorSpace;

        containerRef.current.appendChild(renderer.domElement);

        const isMobile = window.innerWidth < 768;
        const globeRadius = isMobile ? 100 : 160;
        const globeBaseX = isMobile ? 0 : -50;

        // Globe Assets - Responsive Scale
        const geometry = new THREE.SphereGeometry(globeRadius, 64, 64);
        const textureLoader = new THREE.TextureLoader();

        let earthTexture;
        try {
          earthTexture = await new Promise<any>((resolve, reject) => {
            textureLoader.load(
              '/Earth-Night.jpg',
              (texture: any) => {
                texture.colorSpace = THREE.SRGBColorSpace;
                resolve(texture);
              },
              undefined,
              reject
            );
          });
        } catch (e) {
          const canvas = document.createElement('canvas');
          canvas.width = 1024;
          canvas.height = 512;
          const ctx = canvas.getContext('2d')!;
          ctx.fillStyle = '#050a1a';
          ctx.fillRect(0, 0, 1024, 512);
          ctx.fillStyle = '#1e3a8a';
          for (let i = 0; i < 50; i++) {
            ctx.fillRect(Math.random() * 1024, Math.random() * 512, Math.random() * 100, Math.random() * 50);
          }
          earthTexture = new THREE.CanvasTexture(canvas);
          earthTexture.colorSpace = THREE.SRGBColorSpace;
        }

        const material = new THREE.MeshPhongMaterial({
          map: earthTexture,
          shininess: 30,
          emissive: new THREE.Color(0x112244),
          emissiveIntensity: 0.7,
        });

        const globe = new THREE.Mesh(geometry, material);
        // Responsive initial position
        globe.position.x = globeBaseX;
        scene.add(globe);

        // Atmosphere Glow - Responsive
        const atmosphereGeo = new THREE.SphereGeometry(globeRadius, 64, 64);
        const atmosphereMat = new THREE.MeshPhongMaterial({
          color: 0x3b82f6,
          transparent: true,
          opacity: 0.1,
          side: THREE.BackSide,
          blending: THREE.AdditiveBlending,
        });
        const atmosphere = new THREE.Mesh(atmosphereGeo, atmosphereMat);
        atmosphere.scale.set(1.2, 1.2, 1.2);
        atmosphere.position.x = globe.position.x;
        scene.add(atmosphere);

        // Outer Glow
        const outerGlowMat = new THREE.MeshPhongMaterial({
          color: 0x1d4ed8,
          transparent: true,
          opacity: 0.05,
          side: THREE.BackSide,
          blending: THREE.AdditiveBlending,
        });
        const outerGlow = new THREE.Mesh(atmosphereGeo, outerGlowMat);
        outerGlow.scale.set(1.4, 1.4, 1.4);
        outerGlow.position.x = globe.position.x;
        scene.add(outerGlow);

        // Animation state for smoothing
        let targetX = globe.position.x;
        let currentX = globe.position.x;
        let targetRotX = 0;
        let currentRotX = 0;

        const animate = () => {
          if (!isMounted) return;
          animationId = requestAnimationFrame(animate);

          // Constant Rotation
          globe.rotation.y += 0.0006;

          const currentScroll = scrollProgressRef.current;
          const isMobileNow = window.innerWidth < 768;
          const dynamicBaseX = isMobileNow ? 0 : -50;
          const dynamicRange = isMobileNow ? 50 : 200;

          // Smoothed Position - Responsive range
          targetX = dynamicBaseX + (currentScroll * dynamicRange);
          currentX += (targetX - currentX) * 0.05;
          globe.position.x = currentX;
          atmosphere.position.x = currentX;
          outerGlow.position.x = currentX;

          // Smoothed Rotation mapping scroll to X-axis tilt
          targetRotX = currentScroll * (isMobileNow ? 0.2 : 0.35);
          currentRotX += (targetRotX - currentRotX) * 0.05;
          globe.rotation.x = currentRotX;

          renderer.render(scene, camera);
        };
        animate();

        window.addEventListener('resize', handleResize);
        handleResize();

      } catch (err) {
        console.error('❌ EnhancedGlobe Failed:', err);
      }
    };

    initGlobe();

    return () => {
      isMounted = false;
      isInitializedRef.current = false;
      if (animationId !== null) cancelAnimationFrame(animationId);
      if (renderer) {
        renderer.dispose();
        if (containerRef.current?.contains(renderer.domElement)) {
          containerRef.current.removeChild(renderer.domElement);
        }
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-[-50] w-full h-full"
    />
  );
}
