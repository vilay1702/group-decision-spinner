"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { SpinOption } from "@/lib/types";
import { sounds } from "@/lib/sounds";
import { copy } from "@/lib/copy";

interface WheelProps {
  options: SpinOption[];
  spinning: boolean;
  onSpinStart: () => void;
  onResult: (option: SpinOption) => void;
  /** Increment to trigger a spin from outside (e.g. the winner modal). */
  spinSignal?: number;
}

const CX = 50;
const CY = 50;
const R = 47;

// Degrees measured clockwise from 12 o'clock (where the pointer lives).
function polar(deg: number, r: number): [number, number] {
  const rad = ((deg - 90) * Math.PI) / 180;
  return [CX + r * Math.cos(rad), CY + r * Math.sin(rad)];
}

function slicePath(start: number, end: number): string {
  const [x1, y1] = polar(start, R);
  const [x2, y2] = polar(end, R);
  const large = end - start > 180 ? 1 : 0;
  return `M ${CX} ${CY} L ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} Z`;
}

function displayLabel(label: string): string {
  return label.length > 14 ? label.slice(0, 13).trimEnd() + "…" : label;
}

function labelFontSize(count: number, label: string): number {
  const base = count <= 4 ? 6 : count <= 8 ? 5 : count <= 12 ? 4 : 3.4;
  // Keep long labels inside their radial run (~28 units, ~0.55u per char).
  return Math.min(base, 28 / (0.55 * Math.max(label.length, 1)));
}

export function Wheel({
  options,
  spinning,
  onSpinStart,
  onResult,
  spinSignal = 0,
}: WheelProps) {
  const n = options.length;
  const seg = 360 / Math.max(n, 1);

  const svgRef = useRef<SVGSVGElement>(null);
  const pointerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const rotRef = useRef(0);
  const velRef = useRef(0);
  const rafRef = useRef(0);
  const lastTimeRef = useRef(0);
  const lastSegRef = useRef(0);

  const [winnerIdx, setWinnerIdx] = useState<number | null>(null);

  // Refs so the rAF loop and pointer handlers never see stale props.
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const spinningRef = useRef(spinning);
  spinningRef.current = spinning;
  const segRef = useRef(seg);
  segRef.current = seg;

  const applyRotation = useCallback(() => {
    if (svgRef.current) {
      svgRef.current.style.transform = `rotate(${rotRef.current}deg)`;
    }
  }, []);

  const kickPointer = useCallback((speed: number) => {
    const el = pointerRef.current;
    if (!el) return;
    const kick = Math.min(6 + Math.abs(speed) / 250, 18);
    el.animate(
      [
        { transform: `rotate(${-kick}deg)` },
        { transform: "rotate(0deg)" },
      ],
      { duration: 110, easing: "ease-out" },
    );
  }, []);

  const checkTick = useCallback(() => {
    const s = segRef.current;
    if (!s || s >= 360) return;
    const idx = Math.floor(rotRef.current / s);
    if (idx !== lastSegRef.current) {
      lastSegRef.current = idx;
      sounds.tick(velRef.current || 400);
      kickPointer(velRef.current || 400);
      if (navigator.vibrate) navigator.vibrate(4);
    }
  }, [kickPointer]);

  const finishSpin = useCallback(() => {
    const opts = optionsRef.current;
    if (opts.length === 0) return;
    const s = 360 / opts.length;
    const normRot = ((rotRef.current % 360) + 360) % 360;
    const idx = Math.floor(((360 - normRot) % 360) / s);
    const winner = opts[Math.min(idx, opts.length - 1)];
    setWinnerIdx(idx);
    if (navigator.vibrate) navigator.vibrate([30, 40, 60]);
    onResult(winner);
  }, [onResult]);

  const step = useCallback(
    (now: number) => {
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = now;
      let v = velRef.current;
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const k = reduced ? 2.4 : 0.75; // exponential drag
      v *= Math.exp(-k * dt);
      v -= Math.sign(v) * 14 * dt; // linear friction so it actually stops
      if (Math.abs(v) < 8) {
        velRef.current = 0;
        applyRotation();
        finishSpin();
        return;
      }
      velRef.current = v;
      rotRef.current += v * dt;
      applyRotation();
      checkTick();
      rafRef.current = requestAnimationFrame(step);
    },
    [applyRotation, checkTick, finishSpin],
  );

  const launch = useCallback(
    (velocity: number) => {
      if (spinningRef.current || optionsRef.current.length < 2) return;
      setWinnerIdx(null);
      onSpinStart();
      velRef.current = velocity;
      lastTimeRef.current = performance.now();
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(step);
    },
    [onSpinStart, step],
  );

  const handleSpinClick = useCallback(() => {
    launch(2000 + Math.random() * 1500);
  }, [launch]);

  // --- Grab & flick -------------------------------------------------------
  const dragRef = useRef<{
    active: boolean;
    lastAngle: number;
    samples: { t: number; rot: number }[];
  }>({ active: false, lastAngle: 0, samples: [] });

  const pointerAngle = useCallback((e: React.PointerEvent) => {
    const rect = containerRef.current!.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    return ((Math.atan2(dy, dx) * 180) / Math.PI + 90 + 360) % 360;
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (spinningRef.current || optionsRef.current.length < 2) return;
      e.currentTarget.setPointerCapture(e.pointerId);
      dragRef.current = {
        active: true,
        lastAngle: pointerAngle(e),
        samples: [{ t: performance.now(), rot: rotRef.current }],
      };
    },
    [pointerAngle],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const drag = dragRef.current;
      if (!drag.active) return;
      const a = pointerAngle(e);
      let d = a - drag.lastAngle;
      if (d > 180) d -= 360;
      if (d < -180) d += 360;
      drag.lastAngle = a;
      rotRef.current += d;
      velRef.current = 0;
      applyRotation();
      checkTick();
      drag.samples.push({ t: performance.now(), rot: rotRef.current });
      if (drag.samples.length > 12) drag.samples.shift();
    },
    [pointerAngle, applyRotation, checkTick],
  );

  const onPointerUp = useCallback(() => {
    const drag = dragRef.current;
    if (!drag.active) return;
    drag.active = false;
    const now = performance.now();
    const recent = drag.samples.filter((s) => now - s.t < 120);
    if (recent.length >= 2) {
      const first = recent[0];
      const last = recent[recent.length - 1];
      const dt = (last.t - first.t) / 1000;
      if (dt > 0) {
        const v = (last.rot - first.rot) / dt;
        if (Math.abs(v) > 200) {
          // A real flick — send it, with a little extra oomph.
          launch(Math.sign(v) * Math.min(Math.abs(v) * 1.25, 3800));
        }
      }
    }
  }, [launch]);

  // Browser took over the gesture (e.g. the page scrolled) — abort the
  // drag without launching a spin.
  const onPointerCancelDrag = useCallback(() => {
    dragRef.current.active = false;
  }, []);

  // Clear the winner highlight whenever the option set changes.
  useEffect(() => {
    setWinnerIdx(null);
  }, [options]);

  // External spin trigger (winner modal's "spin again").
  useEffect(() => {
    if (spinSignal > 0) {
      launch(2000 + Math.random() * 1500);
    }
  }, [spinSignal, launch]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  const canSpin = n >= 2 && !spinning;

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div
        ref={containerRef}
        // Sized by the column, not the viewport — 88vw ignored the page +
        // card padding and bled out of the card on small screens.
        className="relative w-full max-w-[520px] aspect-square select-none"
        // pan-y keeps vertical page scrolling alive on phones; sideways
        // flicks still reach us as pointer events and spin the wheel.
        style={{ touchAction: "pan-y" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancelDrag}
      >
        {/* Rim */}
        <div className="absolute inset-0 rounded-full border border-border bg-bg shadow-pop" />

        {/* The wheel itself */}
        <svg
          ref={svgRef}
          viewBox="0 0 100 100"
          className="absolute inset-[10px] cursor-grab active:cursor-grabbing will-change-transform"
          style={{ transform: "rotate(0deg)" }}
          aria-label="Decision wheel"
        >
          <defs>
            <radialGradient id="depth" cx="50%" cy="42%" r="65%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.28)" />
              <stop offset="55%" stopColor="rgba(255,255,255,0)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.14)" />
            </radialGradient>
          </defs>

          {n === 0 &&
            // Ghost wheel: six muted slices previewing what's to come
            Array.from({ length: 6 }).map((_, i) => (
              <path
                key={i}
                d={slicePath(i * 60, (i + 1) * 60)}
                fill={
                  i % 2 === 0 ? "var(--color-surface)" : "var(--color-border)"
                }
                stroke="var(--color-border)"
                strokeWidth="0.4"
              />
            ))}
          {n === 1 && (
            <circle cx={CX} cy={CY} r={R} fill={options[0].color} />
          )}
          {n >= 2 &&
            options.map((o, i) => {
              const cls =
                winnerIdx === null
                  ? "slice"
                  : winnerIdx === i
                    ? "slice-winner"
                    : "slice-dimmed";
              return (
                <path
                  key={o.id}
                  d={slicePath(i * seg, (i + 1) * seg)}
                  fill={o.color}
                  stroke="var(--color-surface)"
                  strokeWidth="0.6"
                  className={cls}
                />
              );
            })}

          {/* Labels, radial like a carnival wheel */}
          {n >= 1 &&
            options.map((o, i) => {
              const mid = (i + 0.5) * (n === 1 ? 360 : seg);
              const label = displayLabel(o.label);
              return (
                <text
                  key={o.id}
                  x={CX + 30}
                  y={CY}
                  transform={`rotate(${mid - 90} ${CX} ${CY})`}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={labelFontSize(n, label)}
                  fontWeight="700"
                  fill="rgba(28,25,23,0.88)"
                  style={{ pointerEvents: "none" }}
                >
                  {label}
                </text>
              );
            })}

          {/* Depth shading + peg dots at slice borders */}
          <circle cx={CX} cy={CY} r={R} fill="url(#depth)" pointerEvents="none" />
          {n >= 2 &&
            options.map((_, i) => {
              const [px, py] = polar(i * seg, R - 2.2);
              return (
                <circle
                  key={i}
                  cx={px}
                  cy={py}
                  r="1.1"
                  fill="rgba(255,255,255,0.9)"
                  pointerEvents="none"
                />
              );
            })}
        </svg>

        {/* Empty-state message inside the wheel (replaces the hub until spinnable) */}
        {n < 2 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-10">
            <div className="max-w-[75%] rounded-md border border-border bg-surface px-5 py-4 text-center shadow-card">
              <div className="text-2xl mb-1 animate-float">🎡</div>
              <p className="text-small font-semibold">
                {n === 0 ? copy.emptyWheelTitle : copy.oneOptionTitle}
              </p>
              <p className="mt-1 text-xs text-text-muted">
                {n === 0 ? copy.emptyWheelHint : copy.oneOptionHint}
              </p>
            </div>
          </div>
        )}

        {/* Pointer */}
        <div
          ref={pointerRef}
          className="absolute left-1/2 -top-1 -translate-x-1/2 z-10 origin-top"
        >
          <div className="w-0 h-0 border-l-[14px] border-r-[14px] border-t-[30px] border-l-transparent border-r-transparent border-t-text drop-shadow-[0_3px_5px_rgba(0,0,0,0.25)]" />
        </div>

        {/* Hub / spin button — only once the wheel is actually spinnable */}
        {n >= 2 && (
          <button
            type="button"
            onClick={handleSpinClick}
            disabled={!canSpin}
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10
              w-[26%] aspect-square rounded-full font-display font-bold tracking-wide text-sm sm:text-base
              bg-accent text-white border-4 border-surface
              transition-transform duration-150
              ${canSpin ? "animate-hub-glow hover:scale-105 hover:bg-accent-hover active:scale-95 cursor-pointer" : "cursor-not-allowed"}`}
            aria-label="Spin the wheel"
          >
            {spinning ? "✦" : copy.spin}
          </button>
        )}
      </div>

      <p className="h-4 text-xs text-text-muted text-center whitespace-nowrap">
        {canSpin ? copy.spinHint : spinning ? copy.spinningHint : " "}
      </p>
    </div>
  );
}
