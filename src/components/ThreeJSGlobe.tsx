'use client';

import { useEffect } from 'react';

interface ThreeJSGlobeProps {
  globeRef: React.MutableRefObject<any>;
  globeContainer: React.MutableRefObject<HTMLDivElement | null>;
}

export default function ThreeJSGlobe({ globeRef, globeContainer }: ThreeJSGlobeProps) {
  // renders an interactive rotating globe using three.js and three-globe
  useEffect(() => {
    if (!globeContainer.current) return;

    let scene: any;
    let camera: any;
    let renderer: any;
    let globe: any;

    // dynamically import heavy libraries to avoid server-side window errors
    Promise.all([
      import('three'),
      import('three-globe'),
    ]).then(([THREE, GlobeModule]: [typeof import('three'), any]) => {
      const Globe = GlobeModule.default || GlobeModule;

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.set(0, 0, 150);

      // lighting: very bright ambient plus directional lights
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

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      globeContainer.current!.appendChild(renderer.domElement);

      globe = new Globe({} as any);
      // scale slightly larger for full-screen effect
      globe.scale.set(1.2, 1.2, 1.2);

      // use daytime texture so features are clearly visible
      globe.globeImageUrl = '/Earth-Blue.jpg';
      globe.cloudsImageUrl = '/clouds.png';
      globe.cloudsOpacity(0.3);
      // remove background color so default transparent
      // globe.backgroundColor = '#000000';
      globe.atmosphereColor('lightgray').atmosphereAltitude(0.25);

      // adjust globe material properties if available
      try {
        const mat = globe.globeMaterial();
        if (mat) {
          mat.emissive = new THREE.Color(0x222222);
          mat.emissiveIntensity = 1.0;
          mat.specular = new THREE.Color(0x444444);
          mat.shininess = 20;
          mat.color = new THREE.Color(0xffffff);
        }
      } catch (e) {
        // ignore missing API
      }

      // scatter points example – random locations as placeholder
      const points = Array.from({ length: 300 }, () => ({
        lat: (Math.random() - 0.5) * 180,
        lng: (Math.random() - 0.5) * 360,
        size: Math.random() * 0.01 + 0.005,
        color: ['#ff5722', '#4caf50', '#2196f3'][
          Math.floor(Math.random() * 3)
        ],
      }));
      globe.pointsData(points)
        .pointLat((d: any) => d.lat)
        .pointLng((d: any) => d.lng)
        .pointColor((d: any) => d.color)
        .pointAltitude((d: any) => d.size);

      scene.add(globe);

      const animate = () => {
        const scrollFactor = window.scrollY / window.innerHeight;
        const target = scrollFactor * Math.PI * 2;
        // automatic slow spin plus interpolation toward scroll-based target
        globe.rotation.y += 0.001;
        globe.rotation.y += (target - globe.rotation.y) * 0.1;
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      };
      animate();

      const handleResize = () => {
        if (!globeContainer.current) return;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', handleResize);

      globeRef.current = { scene, camera, renderer, globe };

      return () => {
        window.removeEventListener('resize', handleResize);
        renderer.dispose();
        scene.remove(globe);
      };
    });
  }, []);

  return (
    <div
      ref={globeContainer}
      className="fixed inset-0 pointer-events-none -z-10"
    />
  );
}