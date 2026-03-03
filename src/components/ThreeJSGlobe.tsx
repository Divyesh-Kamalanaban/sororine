'use client';

import { useEffect } from 'react';

interface ThreeJSGlobeProps {
  globeRef: React.MutableRefObject<any>;
  globeContainer: React.MutableRefObject<HTMLDivElement | null>;
}

export default function ThreeJSGlobe({ globeRef, globeContainer }: ThreeJSGlobeProps) {
  useEffect(() => {
    if (!globeContainer.current) return;

    let isMounted = true;
    let animationId: number | null = null;

    const initGlobe = async () => {
      try {
        const THREE = (await import('three')) as any;
        
        if (!isMounted || !globeContainer.current) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
          75,
          window.innerWidth / window.innerHeight,
          0.1,
          1000
        );
        camera.position.set(0, 0, 150);

        // Lighting
        const ambient = new THREE.AmbientLight(0xffffff, 1.5);
        scene.add(ambient);
        
        const dirs = [
          new THREE.DirectionalLight(0xffffff, 1.0),
          new THREE.DirectionalLight(0xffffff, 0.7),
          new THREE.DirectionalLight(0xffffff, 0.7),
        ];
        dirs[0].position.set(5, 3, 5);
        dirs[1].position.set(-5, -3, 5);
        dirs[2].position.set(0, 5, -5);
        dirs.forEach(l => scene.add(l));
        
        const point = new THREE.PointLight(0xffffff, 0.8);
        camera.add(point);
        scene.add(camera);

        // Renderer
        const renderer = new THREE.WebGLRenderer({ 
          alpha: true, 
          antialias: true,
          powerPreference: 'high-performance',
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        globeContainer.current?.appendChild(renderer.domElement);

        // Create Earth sphere
        const geometry = new THREE.SphereGeometry(50, 64, 64);
        const textureLoader = new THREE.TextureLoader();
        
        let earthTexture;
        try {
          earthTexture = await new Promise<any>((resolve, reject) => {
            textureLoader.load(
              '/Earth-Blue.jpg',
              (texture: any) => {
                texture.colorSpace = THREE.SRGBColorSpace;
                resolve(texture);
              },
              undefined,
              reject
            );
          });
        } catch (e) {
          console.warn('Failed to load Earth-Blue.jpg, using fallback');
          // Fallback texture
          const canvas = document.createElement('canvas');
          canvas.width = 512;
          canvas.height = 256;
          const ctx = canvas.getContext('2d')!;
          ctx.fillStyle = '#1a4a7a';
          ctx.fillRect(0, 0, 512, 256);
          ctx.fillStyle = '#0a2a5a';
          for (let i = 0; i < 15; i++) {
            ctx.fillRect(Math.random() * 512, Math.random() * 256, Math.random() * 80, Math.random() * 40);
          }
          earthTexture = new THREE.CanvasTexture(canvas);
          earthTexture.colorSpace = THREE.SRGBColorSpace;
        }
        
        const material = new THREE.MeshPhongMaterial({
          map: earthTexture,
          emissive: new THREE.Color(0x222222),
          emissiveIntensity: 1.0,
          specular: new THREE.Color(0x444444),
          shininess: 20,
        });

        const globe = new THREE.Mesh(geometry, material);
        globe.scale.set(1.2, 1.2, 1.2);
        scene.add(globe);

        globeRef.current = { scene, camera, renderer, globe };

        // Animation loop
        const animate = () => {
          animationId = requestAnimationFrame(animate);
          
          const scrollFactor = window.scrollY / window.innerHeight;
          const target = scrollFactor * Math.PI * 2;
          globe.rotation.y += 0.001;
          globe.rotation.y += (target - globe.rotation.y) * 0.1;
          
          renderer.render(scene, camera);
        };
        animate();

        // Resize handler
        const handleResize = () => {
          if (!globeContainer.current) return;
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
          window.removeEventListener('resize', handleResize);
          if (animationId !== null) {
            cancelAnimationFrame(animationId);
          }
          renderer.dispose();
          geometry.dispose();
          material.dispose();
          if (globeContainer.current?.contains(renderer.domElement)) {
            globeContainer.current.removeChild(renderer.domElement);
          }
        };
      } catch (err) {
        console.error('Failed to initialize ThreeJS Globe:', err);
      }
    };

    const cleanup = initGlobe();

    return () => {
      isMounted = false;
      cleanup.then(fn => fn?.());
    };
  }, [globeContainer, globeRef]);

  return (
    <div
      ref={globeContainer}
      className="fixed inset-0 pointer-events-none -z-10 w-full h-full"
    />
  );
}