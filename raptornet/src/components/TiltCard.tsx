"use client";

import { useState } from "react";

type TiltCardProps = {
  className: string;
  children: React.ReactNode;
};

export default function TiltCard({ className, children }: TiltCardProps) {
  const [transform, setTransform] = useState("perspective(1000px) rotateX(0deg) rotateY(0deg)");
  const [glare, setGlare] = useState("50% 50%");

  const handleMove = (event: React.MouseEvent<HTMLElement>) => {
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();

    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    const rotateY = (x - 0.5) * 18;
    const rotateX = (0.5 - y) * 18;

    setTransform(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`);
    setGlare(`${(x * 100).toFixed(1)}% ${(y * 100).toFixed(1)}%`);
  };

  const resetTilt = () => {
    setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg)");
    setGlare("50% 50%");
  };

  return (
    <article
      className={`${className} relative overflow-hidden`}
      onMouseMove={handleMove}
      onMouseLeave={resetTilt}
      style={{
        transform,
        transformStyle: "preserve-3d",
        transition: "transform 180ms ease-out, box-shadow 180ms ease-out",
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100"
        style={{
          background: `radial-gradient(240px circle at ${glare}, rgba(255,255,255,0.22), rgba(255,255,255,0.04) 36%, transparent 62%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </article>
  );
}
