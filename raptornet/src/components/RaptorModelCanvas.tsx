"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF } from "@react-three/drei";

function RaptorModel() {
  const { scene } = useGLTF("/models/red_the_velociraptor.glb");

  return (
    <primitive
      object={scene}
      position={[0, -0.55, 0]}
      rotation={[0, Math.PI * 0.85, 0]}
      scale={0.2}
    />
  );
}

export default function RaptorModelCanvas() {
  return (
    <div className="h-full w-full">
      <Canvas camera={{ position: [0, 1.85, 10.2], fov: 50 }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[4, 7, 3]} intensity={2.1} color="#ffd8d8" />
        <spotLight
          position={[-3, 8, 5]}
          angle={0.32}
          intensity={2}
          color="#ff5252"
          penumbra={0.7}
        />

        <Suspense fallback={null}>
          <RaptorModel />
          <Environment preset="warehouse" />
        </Suspense>

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 2.5}
          maxPolarAngle={Math.PI / 2.1}
          target={[0, 0.25, 0]}
          autoRotate
          autoRotateSpeed={0.7}
        />
      </Canvas>
    </div>
  );
}

useGLTF.preload("/models/red_the_velociraptor.glb");
