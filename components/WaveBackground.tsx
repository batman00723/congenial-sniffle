"use client";

import { useEffect, useRef } from "react";

interface WaveBackgroundProps {
  isBatman?: boolean;
}

export default function WaveBackground({ isBatman = false }: WaveBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resize);

    const cols = 40;
    const rows = 25;
    const spacing = 45;
    const yOffset = height / 3;
    let time = 0;

    let mouseX = width / 2;
    let mouseY = height / 2;

    const onMouse = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener("mousemove", onMouse);

    let animationFrameId: number;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!isReduced) time += 0.03;

      const mouseInfluenceRadius = 300;
      const points: { x: number; y: number; z: number }[][] = [];

      for (let z = 0; z < rows; z++) {
        const row = [];
        for (let x = 0; x < cols; x++) {
          const worldX = (x - cols / 2) * spacing;
          const worldZ = z * spacing;
          
          let y = Math.sin(worldX * 0.01 + time) * Math.cos(worldZ * 0.02 + time) * 80;

          const projX = width / 2 + worldX / (1 + worldZ * 0.003);
          const projY = yOffset + y + worldZ * 8;
          const dist = Math.hypot(projX - mouseX, projY - mouseY);

          if (dist < mouseInfluenceRadius) {
            const pull = (1 - dist / mouseInfluenceRadius) * 50;
            y -= pull; 
          }
          row.push({ x: worldX, y, z: worldZ });
        }
        points.push(row);
      }

      const fov = 400;
      ctx.lineWidth = 1;

      const lineR = isBatman ? 212 : 139;
      const lineG = isBatman ? 160 : 124;
      const lineB = isBatman ? 23 : 255;

      for (let z = 0; z < rows - 1; z++) {
        for (let x = 0; x < cols - 1; x++) {
          const p = points[z][x];
          const scale = fov / (fov + p.z);
          const drawX = width / 2 + p.x * scale;
          const drawY = yOffset + p.y * scale + p.z * 1.5;

          const pRight = points[z][x + 1];
          const scaleRight = fov / (fov + pRight.z);
          const drawXRight = width / 2 + pRight.x * scaleRight;
          const drawYRight = yOffset + pRight.y * scaleRight + pRight.z * 1.5;

          const pDown = points[z + 1][x];
          const scaleDown = fov / (fov + pDown.z);
          const drawXDown = width / 2 + pDown.x * scaleDown;
          const drawYDown = yOffset + pDown.y * scaleDown + pDown.z * 1.5;

          const alpha = Math.max(0, 1 - p.z / (rows * spacing));
          ctx.strokeStyle = `rgba(${lineR}, ${lineG}, ${lineB}, ${alpha * (isBatman ? 0.3 : 0.4)})`;

          ctx.beginPath();
          ctx.moveTo(drawX, drawY);
          ctx.lineTo(drawXRight, drawYRight);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(drawX, drawY);
          ctx.lineTo(drawXDown, drawYDown);
          ctx.stroke();
          
          if (x % 2 === 0 && z % 2 === 0) {
            ctx.fillStyle = `rgba(${lineR}, ${lineG}, ${lineB}, ${alpha * 0.8})`;
            ctx.beginPath();
            ctx.arc(drawX, drawY, 1.5 * scale, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, [isBatman]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
        background: "transparent",
      }}
    />
  );
}
