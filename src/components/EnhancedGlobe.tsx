'use client';

import { useEffect, useRef } from 'react';

interface EnhancedGlobeProps {
  scrollProgress?: number;
}

export default function EnhancedGlobe({ scrollProgress = 0 }: EnhancedGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let scene: any;
    let camera: any;
    let renderer: any;
    let globe: any;
    let animationId: number;

    Promise.all([
      import('three'),
      import('three-globe'),
    ]).then(([THREE, GlobeModule]: [typeof import('three'), any]) => {
      const Globe = GlobeModule.default || GlobeModule;

      // Scene setup
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x000000);
      scene.fog = new THREE.Fog(0x000000, 0, 800);

      const width = window.innerWidth;
      const height = window.innerHeight;
      const isMobile = width < 640;

      camera = new THREE.PerspectiveCamera(
        isMobile ? 60 : 75,
        width / height,
        0.1,
        1000
      );
      camera.position.set(0, 20, isMobile ? 240 : 200);

      // Refined lighting - subtle and sophisticated
      // higher ambient to lift the dark night texture
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
      scene.add(ambientLight);

      // Key light - cool tone
      const keyLight = new THREE.DirectionalLight(0xccddff, 0.8);
      keyLight.position.set(120, 60, 100);
      keyLight.castShadow = true;
      scene.add(keyLight);

      // camera-aligned fill light to illuminate front faces
      const cameraLight = new THREE.DirectionalLight(0xffffff, 0.6);
      camera.add(cameraLight); // light follows camera
      scene.add(camera);

      // Fill light - warm tone, very subtle
      const fillLight = new THREE.DirectionalLight(0xffccaa, 0.15);
      fillLight.position.set(-100, -40, 0);
      scene.add(fillLight);

      // Back light for rim definition
      const backLight = new THREE.DirectionalLight(0xccddff, 0.25);
      backLight.position.set(0, 100, -100);
      scene.add(backLight);

      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
        logarithmicDepthBuffer: true,
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFShadowMap;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      containerRef.current?.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      // Create globe
      globe = new Globe({} as any);
      const globeScale = isMobile ? 1.0 : 1.3;
      globe.scale.set(globeScale, globeScale, globeScale);
      globeRef.current = globe;

      // Use Earth-Night texture with proper lighting
      globe.globeImageUrl = '/Earth-Night.jpg';
      globe.cloudsImageUrl = '/clouds.png';
      globe.cloudsOpacity(0.3);

      // Slightly more visible atmosphere for contrast
      globe.atmosphereColor('#ffffff').atmosphereAltitude(0.25);
      globe.showAtmosphere(true);

      // Material refinement
      try {
        const globeMat = globe.globeMaterial();
        if (globeMat) {
          globeMat.emissive = new THREE.Color(0x050505);
          globeMat.emissiveIntensity = 0.3;
          globeMat.specular = new THREE.Color(0x1a1a1a);
          globeMat.shininess = 20;
          globeMat.metalness = 0.15;
          globeMat.roughness = 0.6;
        }

        const cloudsMat = globe.cloudsMaterial?.();
        if (cloudsMat) {
          cloudsMat.opacity = 0.2;
          cloudsMat.emissive = new THREE.Color(0x0a0a0a);
          cloudsMat.emissiveIntensity = 0.05;
        }
      } catch (e) {
        // Ignore if APIs not available
      }

      // Very minimal scatter points
      const generatePoints = () => {
        const points = Array.from({ length: 20 }, () => ({
          lat: (Math.random() - 0.5) * 180,
          lng: (Math.random() - 0.5) * 360,
          size: Math.random() * 0.003 + 0.001,
          color: '#4a7c8a',
        }));
        return points;
      };

      const points = generatePoints();
      globe
        .pointsData(points)
        .pointLat((d: any) => d.lat)
        .pointLng((d: any) => d.lng)
        .pointColor((d: any) => d.color)
        .pointAltitude((d: any) => d.size)
        .pointOpacity(0.3)
        .pointRadius(0.3);

      scene.add(globe);

      // Animation loop with scroll responsiveness
      const animate = () => {
        animationId = requestAnimationFrame(animate);

        // Gentle base rotation
        // base slow auto-rotation
        globe.rotation.y += 0.00005;

        // Scroll-influenced rotation offset (not cumulative)
        const scrollRotation = scrollProgress * Math.PI * 0.3;
        globe.rotation.y = globe.rotation.y * 0.85 + scrollRotation * 0.15;

        // Smooth tilt based on scroll (small range)
        const targetTiltX = scrollProgress * 0.15 - 0.05;
        globe.rotation.x += (targetTiltX - globe.rotation.x) * 0.05;

        // Very subtle wobble
        globe.rotation.z = Math.sin(Date.now() * 0.00003) * 0.01;

        renderer.render(scene, camera);
      };
      animate();

      // Handle resize
      const handleResize = () => {
        if (!containerRef.current) return;
        const w = window.innerWidth;
        const h = window.innerHeight;

        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);

        // Update globe scale on resize
        const newScale = w < 640 ? 1.0 : 1.3;
        globe.scale.set(newScale, newScale, newScale);
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationId);
        renderer.dispose();
        if (containerRef.current?.contains(renderer.domElement)) {
          containerRef.current.removeChild(renderer.domElement);
        }
      };
    }).catch(err => console.error('Failed to load Three.js:', err));
  }, [scrollProgress]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none -z-10"
    />
  );
}
