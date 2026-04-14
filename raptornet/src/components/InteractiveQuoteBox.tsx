"use client";

import React from "react";

export default function InteractiveQuoteBox() {
  const [mouse, setMouse] = React.useState({ x: "50%", y: "50%" });

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = `${event.clientX - rect.left}px`;
    const y = `${event.clientY - rect.top}px`;

    setMouse({ x, y });
  };

  return (
    <div
      className="quote-band quote-interactive relative mb-6 overflow-hidden rounded-2xl border border-white/15 bg-[linear-gradient(120deg,rgba(255,255,255,0.05),rgba(10,12,18,0.96)_44%,rgba(255,255,255,0.03)_100%)] p-5 sm:p-6"
      style={{
        ["--mx" as string]: mouse.x,
        ["--my" as string]: mouse.y,
      }}
      onMouseMove={handleMouseMove}
    >
      <span aria-hidden="true" className="quote-border-glow" />
      <p className="quote-kicker text-[10px] font-bold tracking-[0.34em] uppercase text-white/60">
        Predator Mindset
      </p>
      <blockquote className="quote-text mt-3 max-w-4xl text-xl font-black leading-tight tracking-tight text-white/95 sm:text-2xl lg:text-[2.05rem]">
        The raptor hunts. The net only catches the best ones.
      </blockquote>
    </div>
  );
}
