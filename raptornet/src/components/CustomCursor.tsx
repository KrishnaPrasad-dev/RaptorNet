"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [interactive, setInteractive] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    setEnabled(window.matchMedia("(pointer: fine)").matches);
  }, []);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    const isInteractiveTarget = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) {
        return false;
      }

      return Boolean(
        target.closest(
          "a, button, [role='button'], input[type='submit'], input[type='button'], .rn-button"
        )
      );
    };

    const handleMove = (event: MouseEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      setVisible(true);
      setInteractive(isInteractiveTarget(event.target));

      if (dotRef.current) {
        dotRef.current.style.left = `${mouseX}px`;
        dotRef.current.style.top = `${mouseY}px`;
      }
    };

    const handleLeaveWindow = () => {
      setVisible(false);
      setInteractive(false);
    };

    const animate = () => {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;

      if (ringRef.current) {
        ringRef.current.style.left = `${ringX}px`;
        ringRef.current.style.top = `${ringY}px`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseleave", handleLeaveWindow);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseleave", handleLeaveWindow);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [enabled]);

  if (!mounted || !enabled) {
    return null;
  }

  return (
    <>
        <div
          ref={dotRef}
          aria-hidden="true"
          style={{
            position: "fixed",
            left: 0,
            top: 0,
            width: "6px",
            height: "6px",
            borderRadius: "999px",
            backgroundColor: "#ef4444", // Tailwind red-500
            boxShadow: "0 0 12px rgba(239,68,68,0.8)",
            transform: `translate(-50%, -50%) scale(${interactive ? 1.25 : 1})`,
            opacity: visible ? 1 : 0,
            transition: "opacity 140ms ease-out, transform 140ms ease-out",
            pointerEvents: "none",
            zIndex: 9999,
          }}
        />
        <div
          ref={ringRef}
          aria-hidden="true"
          style={{
            position: "fixed",
            left: 0,
            top: 0,
            width: "24px",
            height: "24px",
            borderRadius: "999px",
            border: "1.5px solid rgba(239,68,68,0.8)",
            boxShadow: "0 0 18px rgba(239,68,68,0.35)",
            transform: `translate(-50%, -50%) scale(${interactive ? 1.28 : 1})`,
            opacity: visible ? 1 : 0,
            transition: "opacity 180ms ease-out, transform 160ms ease-out",
            pointerEvents: "none",
            zIndex: 9998,
          }}
        />
    </>
  );
}
