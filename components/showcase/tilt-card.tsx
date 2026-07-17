"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Pointer-tracked presentation wrapper for the ancestor card: restrained 3D
 * tilt (max ~5deg) plus a soft light sheen that follows the cursor. Mouse-only
 * by design — touch gets the static card — and disabled entirely under
 * prefers-reduced-motion.
 */
export function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(!reduced.matches);
    update();
    reduced.addEventListener("change", update);
    return () => reduced.removeEventListener("change", update);
  }, []);

  function handleMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!enabled || event.pointerType !== "mouse" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    ref.current.style.setProperty("--tilt-ry", `${(x - 0.5) * 10}deg`);
    ref.current.style.setProperty("--tilt-rx", `${(0.5 - y) * 10}deg`);
    ref.current.style.setProperty("--sheen-x", `${x * 100}%`);
    ref.current.style.setProperty("--sheen-y", `${y * 100}%`);
    ref.current.style.setProperty("--sheen-o", "1");
  }

  function handleLeave() {
    if (!ref.current) return;
    ref.current.style.setProperty("--tilt-rx", "0deg");
    ref.current.style.setProperty("--tilt-ry", "0deg");
    ref.current.style.setProperty("--sheen-o", "0");
  }

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className={className}
      style={{ perspective: "1100px" }}
    >
      <div
        className="relative transition-transform duration-200 ease-out will-change-transform"
        style={{
          transform: "rotateX(var(--tilt-rx, 0deg)) rotateY(var(--tilt-ry, 0deg))",
          transformStyle: "preserve-3d",
        }}
      >
        {children}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            opacity: "var(--sheen-o, 0)",
            background:
              "radial-gradient(ellipse 60% 45% at var(--sheen-x, 50%) var(--sheen-y, 50%), rgba(255,241,205,0.28), transparent 70%)",
            mixBlendMode: "soft-light",
            borderRadius: "3.5% / 2.6%",
          }}
        />
      </div>
    </div>
  );
}
