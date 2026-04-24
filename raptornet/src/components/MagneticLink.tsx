"use client";

import Link from "next/link";
import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  type MotionValue,
} from "framer-motion";

type MagneticLinkProps = {
  href: string;
  className: string;
  children: React.ReactNode;
  onClick?: () => void;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function resetPosition(x: MotionValue<number>, y: MotionValue<number>) {
  x.set(0);
  y.set(0);
}

export default function MagneticLink({ href, className, children, onClick }: MagneticLinkProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const x = useSpring(rawX, { stiffness: 360, damping: 24, mass: 0.35 });
  const y = useSpring(rawY, { stiffness: 360, damping: 24, mass: 0.35 });

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const element = containerRef.current;
    if (!element) {
      return;
    }

    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = event.clientX - centerX;
    const dy = event.clientY - centerY;
    const distance = Math.hypot(dx, dy);
    const proximity = 130;
    const maxOffset = 9;

    if (distance > proximity) {
      resetPosition(rawX, rawY);
      return;
    }

    const strength = 1 - distance / proximity;
    rawX.set(clamp(dx * 0.22 * strength, -maxOffset, maxOffset));
    rawY.set(clamp(dy * 0.22 * strength, -maxOffset, maxOffset));
  };

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => resetPosition(rawX, rawY)}
      style={{ x, y }}
      className="inline-block"
    >
      <Link href={href} onClick={onClick} className={className}>
        {children}
      </Link>
    </motion.div>
  );
}
