"use client";

import { useEffect, useRef } from "react";
import { PALETTE } from "@/lib/palette";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  rot: number;
  vr: number;
  color: string;
  born: number;
  life: number;
  shape: "rect" | "circle";
}

/** Full-screen canvas confetti. Increment `burst` to fire a new volley. */
export function Confetti({ burst }: { burst: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef(0);
  const runningRef = useRef(false);

  useEffect(() => {
    if (burst === 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const W = window.innerWidth;
    const H = window.innerHeight;
    const now = performance.now();

    // Two cannons at the bottom corners plus a shower from the top.
    const spawn = (count: number, make: () => Partial<Particle>) => {
      for (let i = 0; i < count; i++) {
        const base = make();
        particlesRef.current.push({
          x: 0,
          y: 0,
          vx: 0,
          vy: 0,
          w: 5 + Math.random() * 6,
          h: 3 + Math.random() * 5,
          rot: Math.random() * Math.PI * 2,
          vr: (Math.random() - 0.5) * 12,
          color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
          born: now,
          life: 1800 + Math.random() * 900,
          shape: Math.random() < 0.3 ? "circle" : "rect",
          ...base,
        });
      }
    };

    spawn(70, () => ({
      x: -10,
      y: H * (0.7 + Math.random() * 0.3),
      vx: 250 + Math.random() * 450,
      vy: -(650 + Math.random() * 550),
    }));
    spawn(70, () => ({
      x: W + 10,
      y: H * (0.7 + Math.random() * 0.3),
      vx: -(250 + Math.random() * 450),
      vy: -(650 + Math.random() * 550),
    }));
    spawn(50, () => ({
      x: Math.random() * W,
      y: -12,
      vx: (Math.random() - 0.5) * 160,
      vy: 60 + Math.random() * 160,
    }));

    if (runningRef.current) return;
    runningRef.current = true;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      runningRef.current = false;
      return;
    }
    ctx.scale(dpr, dpr);

    let last = now;
    const loop = (t: number) => {
      const dt = Math.min((t - last) / 1000, 0.05);
      last = t;
      ctx.clearRect(0, 0, W, H);
      const alive: Particle[] = [];
      for (const p of particlesRef.current) {
        const age = t - p.born;
        if (age > p.life) continue;
        p.vy += 900 * dt; // gravity
        p.vx *= 1 - 0.9 * dt; // air drag
        p.vy *= 1 - 0.25 * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.rot += p.vr * dt;
        if (p.y > H + 30) continue;
        const fade = Math.min(1, (p.life - age) / 400);
        ctx.save();
        ctx.globalAlpha = fade;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        if (p.shape === "rect") {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.w / 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
        alive.push(p);
      }
      particlesRef.current = alive;
      if (alive.length > 0) {
        rafRef.current = requestAnimationFrame(loop);
      } else {
        ctx.clearRect(0, 0, W, H);
        runningRef.current = false;
      }
    };
    rafRef.current = requestAnimationFrame(loop);
  }, [burst]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[60] pointer-events-none w-full h-full"
      aria-hidden="true"
    />
  );
}
