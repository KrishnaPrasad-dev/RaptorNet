"use client";

import { Suspense, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
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
  const gl = useThree((state) => state.gl);

  useEffect(() => {
    const maxAnisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());

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

        texture.anisotropy = maxAnisotropy;
        texture.minFilter = LinearMipmapLinearFilter;
        texture.magFilter = LinearFilter;
        texture.needsUpdate = true;
      });
    });
  }, [scene, gl]);

  return (
    <primitive
      object={scene}
      position={[2.8, -3.3, -0.9]}
      rotation={[0.05, Math.PI * 1.55, 0]}
      scale={0.34}
    />
  );
}

export default function RaptorModelCanvas() {
  return (
    <div className="h-full w-full overflow-hidden rounded-[2.25rem]">
      <Canvas
        camera={{ position: [0.2, 2.55, 6.9], fov: 30 }}
        dpr={[2, 2.5]}
        shadows
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          precision: "highp",
        }}
        onCreated={({ gl: renderer }) => {
          renderer.outputColorSpace = SRGBColorSpace;
          renderer.toneMapping = ACESFilmicToneMapping;
          renderer.toneMappingExposure = 1.05;
        }}
      >
        <ambientLight intensity={0.45} />
        <hemisphereLight
          intensity={0.55}
          color="#ffd6bf"
          groundColor="#260809"
        />
        <directionalLight
          position={[4, 8, 2]}
          intensity={1.7}
          color="#ffe0d0"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <spotLight
          position={[-2, 6, 6]}
          angle={0.33}
          intensity={1.55}
          color="#ff5252"
          penumbra={0.85}
          distance={22}
        />

        <Suspense fallback={null}>
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

useGLTF.preload("/models/red_the_velociraptor.glb");
