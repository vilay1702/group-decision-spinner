"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { SpinOption, SpinRecord } from "@/lib/types";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { sounds } from "@/lib/sounds";
import { copy } from "@/lib/copy";
import { TOOL_DESCRIPTION, TOOL_H1 } from "@/lib/brand";
import { Wheel } from "@/components/Wheel";
import { Confetti } from "@/components/Confetti";
import { WinnerModal } from "@/components/WinnerModal";
import { OptionManager } from "@/components/OptionManager";
import { HistoryPanel } from "@/components/HistoryPanel";
import { ToolShell } from "@/components/ui/ToolShell";

const HISTORY_LIMIT = 50;

const HOW_IT_WORKS = [
  "Add your options — dinner spots, movie picks, chore victims — or load a preset.",
  "Tap Spin, or grab the wheel and flick it. A real friction simulation decides where it stops.",
  "Accept the result, spin again, or remove the winner and spin the rest for elimination rounds.",
];

export default function Home() {
  const [options, setOptions, hydrated] = useLocalStorage<SpinOption[]>(
    "gds:options:v1",
    [],
  );
  const [history, setHistory] = useLocalStorage<SpinRecord[]>(
    "gds:history:v1",
    [],
  );
  const [muted, setMuted] = useLocalStorage<boolean>("gds:muted:v1", false);

  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<SpinOption | null>(null);
  const [burst, setBurst] = useState(0);
  const [spinSignal, setSpinSignal] = useState(0);
  const revealTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    sounds.muted = muted;
  }, [muted]);

  useEffect(
    () => () => {
      if (revealTimer.current) clearTimeout(revealTimer.current);
    },
    [],
  );

  const handleSpinStart = useCallback(() => {
    setWinner(null);
    setSpinning(true);
  }, []);

  const handleResult = useCallback(
    (option: SpinOption) => {
      setSpinning(false);
      setHistory((prev) =>
        [
          {
            id: crypto.randomUUID(),
            winner: option.label,
            color: option.color,
            at: Date.now(),
          },
          ...prev,
        ].slice(0, HISTORY_LIMIT),
      );
      // Let the winning slice flash for a beat before the big reveal.
      revealTimer.current = setTimeout(() => {
        sounds.win();
        setBurst((b) => b + 1);
        setWinner(option);
      }, 450);
    },
    [setHistory],
  );

  const requestSpin = useCallback(() => {
    setWinner(null);
    setSpinSignal((s) => s + 1);
  }, []);

  const removeWinnerAndSpin = useCallback(() => {
    if (!winner) return;
    const id = winner.id;
    setOptions((prev) => prev.filter((o) => o.id !== id));
    requestSpin();
  }, [winner, setOptions, requestSpin]);

  return (
    <ToolShell
      h1={TOOL_H1}
      description={TOOL_DESCRIPTION}
      privacyLine={copy.privacy}
      howItWorks={HOW_IT_WORKS}
    >
      <Confetti burst={burst} />

      <div className="relative grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-start">
        <button
          onClick={() => setMuted((m) => !m)}
          aria-label={muted ? "Unmute sounds" : "Mute sounds"}
          className="absolute -top-1 -right-1 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-base shadow-card transition hover:bg-accent-soft active:scale-95"
        >
          {muted ? "🔇" : "🔊"}
        </button>

        {/* min-w-0 on both grid children: otherwise the input's intrinsic
            width sets the column's min-content and overflows small screens */}
        <div className="flex min-w-0 justify-center lg:sticky lg:top-8">
          <Wheel
            options={options}
            spinning={spinning}
            onSpinStart={handleSpinStart}
            onResult={handleResult}
            spinSignal={spinSignal}
          />
        </div>

        <div className="min-w-0 space-y-6">
          <OptionManager
            options={options}
            setOptions={(updater) => setOptions(updater)}
            disabled={spinning}
            hydrated={hydrated}
          />
          <HistoryPanel history={history} onClear={() => setHistory([])} />
        </div>
      </div>

      {winner && (
        <WinnerModal
          winner={winner}
          history={history}
          canRemove={options.length > 2}
          onClose={() => setWinner(null)}
          onSpinAgain={requestSpin}
          onRemoveAndSpin={removeWinnerAndSpin}
        />
      )}
    </ToolShell>
  );
}
