"use client";

import { useEffect, useRef } from "react";

interface GridBackgroundProps {
  isBatman?: boolean;
}

const NUM_NODES = 72;
const SPHERE_R = 320;
const CONNECT_DIST = 190;
const FOV_BASE = 520;

interface Node {
  ox: number; oy: number; oz: number; // drifting origin
  tx: number; ty: number; tz: number; // target origin
  vx: number; vy: number; vz: number; // drift velocity
  phase: number;                       // pulse phase offset
  isHub: boolean;                      // hub nodes are slightly larger
  // computed each frame
  rx: number; ry: number; rz: number; // after rotation
  px: number; py: number;             // projected 2D
  depth: number;                       // perspective scale
}

export default function GridBackground({ isBatman = false }: GridBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const tiltRef = useRef({ x: 0, y: 0 }); // smoothed mouse tilt

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ── Generate nodes distributed in 3D ──────────────────────────
    const nodes: Node[] = Array.from({ length: NUM_NODES }, (_, i) => {
      let ox, oy, oz;
      
      if (isBatman) {
        // Batman mode: Sphere distribution
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = Math.cbrt(Math.random()) * SPHERE_R;
        ox = r * Math.sin(phi) * Math.cos(theta);
        oy = r * Math.sin(phi) * Math.sin(theta);
        oz = r * Math.cos(phi);
      } else {
        // Light mode: Torus (Donut) structure
        const R = SPHERE_R * 0.8; // major radius
        const r = SPHERE_R * 0.35; // minor radius
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI * 2;
        
        ox = (R + r * Math.cos(theta)) * Math.cos(phi);
        oy = r * Math.sin(theta); 
        oz = (R + r * Math.cos(theta)) * Math.sin(phi);
      }
      
      return {
        ox,
        oy,
        oz,
        tx: ox,
        ty: oy,
        tz: oz,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        vz: (Math.random() - 0.5) * 0.18,
        phase: Math.random() * Math.PI * 2,
        isHub: i < 8, // first 8 are hub nodes
        rx: 0, ry: 0, rz: 0,
        px: 0, py: 0, depth: 1,
      };
    });

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const onMouse = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    };

    let startTime: number | null = null;

    const draw = (ts: number) => {
      if (!startTime) startTime = ts;
      const t = prefersReduced ? 0 : (ts - startTime) * 0.001;

      const W = canvas.width;
      const H = canvas.height;
      const cx = W / 2;
      const cy = H / 2;
      const FOV = Math.min(W, H) * (W < 768 ? 0.7 : 0.55) + FOV_BASE;

      ctx.clearRect(0, 0, W, H);

      // ── Accent colour ───────────────────────────────────────────────────────
      const ar = isBatman ? 196 : 139;
      const ag = isBatman ? 181 : 124;
      const ab = 255;

      // ── Auto-rotate + smooth mouse tilt ────────────────────────────────────
      const autoY = t * 0.12;
      const autoX = Math.sin(t * 0.07) * 0.18;
      const targetTiltX = mouseRef.current.y * 0.22;
      const targetTiltY = mouseRef.current.x * 0.28;
      tiltRef.current.x += (targetTiltX - tiltRef.current.x) * 0.04;
      tiltRef.current.y += (targetTiltY - tiltRef.current.y) * 0.04;

      const rotX = autoX + tiltRef.current.x;
      const rotY = autoY + tiltRef.current.y;

      const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
      const cosY = Math.cos(rotY), sinY = Math.sin(rotY);

      // ── Update + project every node ─────────────────────────────────────────
      nodes.forEach((n) => {
        // Drift
        if (!prefersReduced) {
          n.ox += n.vx;
          n.oy += n.vy;
          n.oz += n.vz;
          
          // Spring back to target shape to maintain the Torus/Sphere structure
          n.vx += (n.tx - n.ox) * 0.002;
          n.vy += (n.ty - n.oy) * 0.002;
          n.vz += (n.tz - n.oz) * 0.002;
          
          // Friction to prevent infinite oscillation
          n.vx *= 0.98;
          n.vy *= 0.98;
          n.vz *= 0.98;
        }

        // Rotate Y then X
        const x1 = n.ox * cosY - n.oz * sinY;
        const z1 = n.ox * sinY + n.oz * cosY;
        const y2 = n.oy * cosX - z1 * sinX;
        const z2 = n.oy * sinX + z1 * cosX;

        n.rx = x1; n.ry = y2; n.rz = z2;

        // Perspective projection
        const depth = FOV / (FOV + n.rz + SPHERE_R * 0.6);
        n.px = cx + n.rx * depth;
        n.py = cy + n.ry * depth;
        n.depth = depth;
      });

      // Sort back-to-front for correct overdraw
      const sorted = [...nodes].sort((a, b) => b.rz - a.rz);

      // ── Draw connections ────────────────────────────────────────────────────
      for (let i = 0; i < sorted.length; i++) {
        for (let j = i + 1; j < sorted.length; j++) {
          const a = sorted[i];
          const b = sorted[j];
          const dx = a.rx - b.rx;
          const dy = a.ry - b.ry;
          const dz = a.rz - b.rz;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < CONNECT_DIST) {
            const nearFactor = 1 - dist / CONNECT_DIST;
            const depthFactor = Math.min(a.depth, b.depth);
            const alpha = nearFactor * nearFactor * depthFactor * (isBatman ? 0.22 : 0.45);

            // Highlight hub connections slightly
            const isHubConn = a.isHub || b.isHub;

            ctx.beginPath();
            ctx.moveTo(a.px, a.py);
            ctx.lineTo(b.px, b.py);
            ctx.strokeStyle = `rgba(${ar},${ag},${ab},${alpha * (isHubConn ? 1.6 : 1)})`;
            ctx.lineWidth = isHubConn ? 0.9 : 0.5;
            ctx.stroke();
          }
        }
      }

      // ── Draw nodes ──────────────────────────────────────────────────────────
      sorted.forEach((n) => {
        const pulse = 0.65 + Math.sin(t * 1.8 + n.phase) * 0.35;
        const baseR = n.isHub ? 3.2 : 1.8;
        const r = baseR * n.depth * pulse;
        const alpha = n.depth * (n.isHub ? 0.95 : 0.7) * (isBatman ? 0.7 : 1);

        if (r < 0.3) return;

        // Outer glow for hub nodes
        if (n.isHub) {
          const grd = ctx.createRadialGradient(n.px, n.py, 0, n.px, n.py, r * 3.5);
          grd.addColorStop(0, `rgba(${ar},${ag},${ab},${alpha * 0.35})`);
          grd.addColorStop(1, `rgba(${ar},${ag},${ab},0)`);
          ctx.beginPath();
          ctx.arc(n.px, n.py, r * 3.5, 0, Math.PI * 2);
          ctx.fillStyle = grd;
          ctx.fill();
        }

        // Core dot
        ctx.beginPath();
        ctx.arc(n.px, n.py, Math.max(0.4, r), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${ar},${ag},${ab},${alpha})`;
        ctx.fill();
      });

      // ── Vignette to blend into page ────────────────────────────────────────
      const bg = isBatman ? "13,13,13" : "255,255,255";
      const vig = ctx.createRadialGradient(cx, cy, H * 0.08, cx, cy, H * 0.78);
      vig.addColorStop(0, `rgba(${bg},0)`);
      vig.addColorStop(0.7, `rgba(${bg},0.1)`);
      vig.addColorStop(1, `rgba(${bg},0.92)`);
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);

      rafRef.current = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouse, { passive: true });
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, [isBatman]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
