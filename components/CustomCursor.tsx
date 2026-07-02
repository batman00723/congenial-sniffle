"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface CustomCursorProps {
  isBatman?: boolean;
}

export default function CustomCursor({ isBatman = false }: CustomCursorProps) {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const ringPosRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const stateRef = useRef<"default" | "hover" | "text">("default");

  useEffect(() => {
    document.body.classList.add("custom-cursor");

    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };

      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top = `${e.clientY}px`;
      }

      // Determine cursor state
      const target = e.target as HTMLElement;
      const isClickable =
        target.closest("a, button, [role='button'], .dock-item, .system-card, .arch-node, .command-item") !== null;
      const isText = target.closest("p, h1, h2, h3, h4, h5, h6, span, li") !== null && !isClickable;

      const newState = isClickable ? "hover" : isText ? "text" : "default";
      if (newState !== stateRef.current) {
        stateRef.current = newState;
        if (dotRef.current) {
          dotRef.current.className = `cursor-dot ${newState !== "default" ? `cursor-${newState}` : ""}`;
        }
        if (ringRef.current) {
          ringRef.current.className = `cursor-ring ${newState !== "default" ? `cursor-${newState}` : ""}`;
        }
      }
    };

    const animateRing = () => {
      const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
      ringPosRef.current.x = lerp(ringPosRef.current.x, posRef.current.x, 0.12);
      ringPosRef.current.y = lerp(ringPosRef.current.y, posRef.current.y, 0.12);

      if (ringRef.current) {
        ringRef.current.style.left = `${ringPosRef.current.x}px`;
        ringRef.current.style.top = `${ringPosRef.current.y}px`;
      }

      rafRef.current = requestAnimationFrame(animateRing);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    rafRef.current = requestAnimationFrame(animateRing);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
      document.body.classList.remove("custom-cursor");
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="cursor-dot"
        style={{
          borderColor: isBatman ? "var(--batman-gold)" : undefined,
          backgroundColor: "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          width="24"
          height="14"
          viewBox="0 0 100 58"
          fill="currentColor"
          style={{
            color: isBatman ? "rgba(212, 160, 23, 0.65)" : "var(--black)",
            transform: "scale(1.2)",
          }}
        >
          <path d="M 50 58 C 42 50 33 46 22 46 C 26 35 25 24 16 20 C 13 18 10 18 6 18 C 11 11 20 6 30 5 C 33 11 37 13 42 11 C 44 9 46 6 46 0 L 48 3 L 52 3 L 54 0 C 54 6 56 9 58 11 C 63 13 67 11 70 5 C 80 6 89 11 94 18 C 90 18 87 18 84 20 C 75 24 74 35 78 46 C 67 46 58 50 50 58 Z" />
        </svg>
      </div>
    </>
  );
}
