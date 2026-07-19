"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Pointer-tracked presentation wrapper for the ancestor card: restrained 3D
 * tilt (max ~5deg), plus the cursor position published as --sheen-x/y/o for
 * descendants to light themselves with. AncestorCard owns the lighting itself,
 * because it alone knows which material maps the frame has. Mouse-only by
 * design — touch gets the static card — and disabled entirely under
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
      </div>
    </div>
  );
}
