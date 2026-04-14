"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Html, OrbitControls, useProgress, useGLTF } from "@react-three/drei";
import {
  ACESFilmicToneMapping,
  LinearFilter,
  LinearMipmapLinearFilter,
  Mesh,
  SRGBColorSpace,
  Texture,
} from "three";

function RaptorModel() {
  const { scene } = useGLTF("/models/red_the_velociraptor.glb");

  useEffect(() => {
    scene.traverse((object) => {
      if (!(object instanceof Mesh) || !object.material) {
        return;
      }

      object.castShadow = true;
      object.receiveShadow = true;

      const materials = Array.isArray(object.material)
        ? object.material
        : [object.material];

      materials.forEach((material) => {
        const texture = (material as { map?: Texture | null }).map;
        if (!texture) {
          return;
        }

        texture.anisotropy = 8;
        texture.minFilter = LinearMipmapLinearFilter;
        texture.magFilter = LinearFilter;
        texture.needsUpdate = true;
      });
    });
  }, [scene]);

  return (
    <primitive
      object={scene}
      position={[2.8, -3.3, -0.9]}
      rotation={[0.05, Math.PI * 1.55, 0]}
      scale={0.34}
    />
  );
}

function Loader() {
  const { progress } = useProgress();

  return (
    <Html center>
      <div className="pointer-events-none flex min-w-[220px] flex-col items-center gap-4 rounded-[1.5rem] border border-white/10 bg-black/70 px-6 py-5 text-white shadow-[0_0_60px_rgba(127,16,32,0.28)] backdrop-blur-2xl">
        <div className="relative flex h-14 w-14 items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-white/10" />
          <div className="absolute inset-0 rounded-full border-2 border-t-[#7f1020] border-r-transparent border-b-transparent border-l-transparent animate-spin" />
          <div className="h-5 w-5 rounded-full bg-[#7f1020] shadow-[0_0_24px_rgba(127,16,32,0.75)]" />
        </div>

        <div className="text-center">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.4em] text-white/65">
            Loading Raptor
          </p>
          <p className="mt-1 text-sm text-white/90">
            {Math.round(progress)}%
          </p>
        </div>

        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-[linear-gradient(90deg,#7f1020,#b91c1c,#ef4444)] transition-all duration-200"
            style={{ width: `${Math.max(progress, 8)}%` }}
          />
        </div>
      </div>
    </Html>
  );
}

export default function RaptorModelCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const updateViewport = () => setIsDesktop(mediaQuery.matches);

    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);

    return () => mediaQuery.removeEventListener("change", updateViewport);
  }, []);

  useEffect(() => {
    const node = containerRef.current;
    if (!node || !isDesktop) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.12 }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [isDesktop]);

  if (!isDesktop || !isVisible) {
    return <div ref={containerRef} className="h-full w-full" />;
  }

  return (
    <div ref={containerRef} className="h-full w-full overflow-hidden">
      <Canvas
        camera={{ position: [0.2, 2.55, 6.9], fov: 30 }}
        dpr={[1, 1.5]}
        shadows
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
          precision: "highp",
        }}
        onCreated={({ gl: renderer }) => {
          renderer.outputColorSpace = SRGBColorSpace;
          renderer.toneMapping = ACESFilmicToneMapping;
          renderer.toneMappingExposure = 1.08;
        }}
      >
        <ambientLight intensity={0.6} />
        <hemisphereLight
          intensity={0.65}
          color="#ffe9d8"
          groundColor="#1a1014"
        />
        <directionalLight
          position={[5, 8, 3]}
          intensity={2.1}
          color="#fff0e6"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <spotLight
          position={[-3, 7, 6]}
          angle={0.36}
          intensity={2.1}
          color="#ff3b3b"
          penumbra={0.8}
          distance={24}
        />

        <Suspense fallback={<Loader />}>
          <RaptorModel />
          <Environment preset="sunset" />
        </Suspense>

        <OrbitControls
          enablePan={true}
          enableZoom={false}
          target={[0.35, 1.7, 0]}
          autoRotate={false}
          enableDamping
          dampingFactor={0.08}
        />
      </Canvas>
    </div>
  );
}
