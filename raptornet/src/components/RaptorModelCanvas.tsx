"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Html, OrbitControls, useGLTF } from "@react-three/drei";
import {
  ACESFilmicToneMapping,
  LinearFilter,
  LinearMipmapLinearFilter,
  Mesh,
  SRGBColorSpace,
  Texture,
} from "three";

function RaptorModel({ mobilePreview = false }: { mobilePreview?: boolean }) {
  const { scene } = useGLTF("/models/red_the_velociraptor.glb");
  const modelPosition = mobilePreview ? [3.4, -4.43, -0.48] : [2.35, -3.25, -0.85];
  const modelRotation = [0.04, Math.PI * 1.58, 0] as const;
  const modelScale = mobilePreview ? 0.38 : 0.31;

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
      position={modelPosition}
      rotation={modelRotation}
      scale={modelScale}
    />
  );
}

function Loader() {
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
          <p className="mt-1 text-sm text-white/90">Preparing scene...</p>
        </div>

        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full w-1/2 rounded-full bg-[linear-gradient(90deg,#7f1020,#b91c1c,#ef4444)] animate-pulse"
          />
        </div>
      </div>
    </Html>
  );
}

export default function RaptorModelCanvas({
  mobileEnabled = false,
}: {
  mobileEnabled?: boolean;
}) {
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
    if (!node) {
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
  }, []);

  if (!isVisible) {
    return <div ref={containerRef} className="h-full w-full" />;
  }

  if (!isDesktop && !mobileEnabled) {
    return <div ref={containerRef} className="h-full w-full" />;
  }

  if (!isDesktop && mobileEnabled) {
    return (
      <div ref={containerRef} className="flex h-full w-full items-center justify-center overflow-hidden">
        <Canvas
          style={{ touchAction: "pan-y" }}
          camera={{ position: [0.1, 2.52, 6.75], fov: 32 }}
          dpr={[0.9, 1.2]}
          shadows={false}
          gl={{
            antialias: false,
            alpha: true,
            powerPreference: "high-performance",
            precision: "mediump",
          }}
          onCreated={({ gl: renderer }) => {
            renderer.outputColorSpace = SRGBColorSpace;
            renderer.toneMapping = ACESFilmicToneMapping;
            renderer.toneMappingExposure = 1.03;
          }}
        >
          <ambientLight intensity={0.82} />
          <hemisphereLight
            intensity={0.48}
            color="#ffe9d8"
            groundColor="#1a1014"
          />

          <Suspense fallback={<Loader />}>
            <RaptorModel mobilePreview />
          </Suspense>

          <OrbitControls
            enablePan={false}
            enableZoom={false}
            enableRotate={false}
            target={[0.05, 1.2, 0]}
          />
        </Canvas>
        <div
          aria-hidden
          className="absolute inset-0 z-10"
          style={{ touchAction: "pan-y" }}
        />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex h-full w-full items-center justify-center overflow-hidden">
      <Canvas
        camera={{ position: [0.15, 2.7, 7.6], fov: 33 }}
        dpr={[1, 1.4]}
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
          target={[0.2, 1.55, 0]}
          autoRotate={false}
          enableDamping
          dampingFactor={0.08}
        />
      </Canvas>
    </div>
  );
}
