"use client";

import { useEffect, useMemo } from "react";
import type { SpinOption, SpinRecord } from "@/lib/types";
import { copy } from "@/lib/copy";
import { TOOL_NAME } from "@/lib/brand";
import { Button } from "@/components/ui/Button";

const FLAVOR = [
  "The wheel has spoken. 🔮",
  "No take-backs — wheel rules. ⚖️",
  "Destiny has been served. ✨",
  "It was written in the stars. 🌟",
  "Fate said so, take it up with fate. 🎯",
  "A flawless democratic process. 🗳️",
];

interface WinnerModalProps {
  winner: SpinOption;
  history: SpinRecord[];
  onSpinAgain: () => void;
  onRemoveAndSpin: () => void;
  onClose: () => void;
  canRemove: boolean;
}

export function WinnerModal({
  winner,
  history,
  onSpinAgain,
  onRemoveAndSpin,
  onClose,
  canRemove,
}: WinnerModalProps) {
  const flavor = useMemo(
    () => FLAVOR[Math.floor(Math.random() * FLAVOR.length)],
    [],
  );
  const winCount = useMemo(
    () => history.filter((h) => h.winner === winner.label).length,
    [history, winner.label],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Winner: ${winner.label}`}
    >
      <div
        className="absolute inset-0 bg-scrim backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative animate-pop-in w-full max-w-sm rounded-lg border border-border bg-surface p-6 sm:p-8 text-center shadow-pop max-h-[85dvh] overflow-y-auto">
        <div className="text-5xl mb-3 animate-float">🏆</div>
        <p className="text-xs uppercase tracking-[0.3em] text-text-muted mb-2">
          {copy.winnerKicker}
        </p>
        <div className="flex items-center justify-center gap-3 mb-2">
          <span
            className="inline-block w-4 h-4 rounded-full shrink-0"
            style={{ backgroundColor: winner.color }}
          />
          <h2 className="font-display text-h2 font-bold break-words min-w-0">
            {winner.label}
          </h2>
        </div>
        <p className="text-small text-text-muted mb-1">{flavor}</p>
        {winCount > 1 && (
          <p className="text-xs font-medium text-accent mb-4">
            {copy.onARoll(winCount, winner.label)}
          </p>
        )}
        <div className="mt-6 flex flex-col gap-2">
          <Button variant="primary" onClick={onSpinAgain} className="py-3">
            🎲 {copy.spinAgain}
          </Button>
          {canRemove && (
            <Button onClick={onRemoveAndSpin} className="py-3">
              {copy.removeAndSpin(winner.label)}
            </Button>
          )}
          <Button variant="ghost" onClick={onClose} className="py-2">
            {copy.acceptFate}
          </Button>
        </div>
        {/* Shareable surface — carry the brand (screenshot-friendly) */}
        <p className="mt-5 text-[11px] text-text-muted/70">
          <b className="font-display font-bold">{TOOL_NAME}</b>
        </p>
      </div>
    </div>
  );
}
