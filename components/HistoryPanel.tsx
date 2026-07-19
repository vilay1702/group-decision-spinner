"use client";

import { useMemo } from "react";
import type { SpinRecord } from "@/lib/types";
import { copy } from "@/lib/copy";
import { Card } from "@/components/ui/Card";

function timeAgo(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 10) return "just now";
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(ts).toLocaleDateString();
}

interface HistoryPanelProps {
  history: SpinRecord[];
  onClear: () => void;
}

export function HistoryPanel({ history, onClear }: HistoryPanelProps) {
  const tally = useMemo(() => {
    const counts = new Map<string, { count: number; color: string }>();
    for (const h of history) {
      const cur = counts.get(h.winner);
      counts.set(h.winner, {
        count: (cur?.count ?? 0) + 1,
        color: cur?.color ?? h.color,
      });
    }
    return [...counts.entries()]
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 5);
  }, [history]);

  if (history.length === 0) {
    return (
      <Card tone="tinted">
        <h2 className="font-display text-h3 font-semibold mb-2">
          {copy.historyTitle}
        </h2>
        <p className="text-small text-text-muted">{copy.historyEmpty}</p>
      </Card>
    );
  }

  return (
    <Card tone="tinted">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-h3 font-semibold">
          {copy.historyTitle}{" "}
          <span className="text-small font-normal text-text-muted">
            {history.length}
          </span>
        </h2>
        <button
          onClick={onClear}
          className="text-xs text-text-muted hover:text-danger transition"
        >
          {copy.clear}
        </button>
      </div>

      {tally.length > 1 && (
        <div className="mb-4 flex flex-wrap gap-1.5">
          {tally.map(([label, { count, color }]) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-[11px] text-text-muted"
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: color }}
              />
              {label} <b className="text-text">×{count}</b>
            </span>
          ))}
        </div>
      )}

      <ol className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
        {history.map((h, i) => (
          <li
            key={h.id}
            className="flex items-center gap-3 rounded-sm border border-border bg-surface px-3.5 py-2"
          >
            <span className="text-xs text-text-muted/70 w-5 text-right shrink-0">
              {history.length - i}
            </span>
            <span
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: h.color }}
            />
            <span className="flex-1 min-w-0 truncate text-small">
              {h.winner}
            </span>
            <span className="text-[11px] text-text-muted/70 shrink-0">
              {timeAgo(h.at)}
            </span>
          </li>
        ))}
      </ol>
    </Card>
  );
}
