"use client";

import { useState } from "react";
import type { SpinOption } from "@/lib/types";
import { nextColor } from "@/lib/palette";
import { sounds } from "@/lib/sounds";
import { copy } from "@/lib/copy";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export const MAX_OPTIONS = 16;

const PRESETS: { name: string; items: string[] }[] = [
  {
    name: "🍕 Dinner",
    items: ["Pizza", "Sushi", "Tacos", "Burgers", "Thai", "Ramen"],
  },
  {
    name: "🎬 Movie night",
    items: ["Comedy", "Horror", "Sci-fi", "Action", "Animation", "Rom-com"],
  },
  {
    name: "🎯 Weekend plans",
    items: [
      "Hiking",
      "Museum",
      "Beach day",
      "Game night",
      "Road trip",
      "Absolutely nothing",
    ],
  },
];

interface OptionManagerProps {
  options: SpinOption[];
  setOptions: (updater: (prev: SpinOption[]) => SpinOption[]) => void;
  disabled: boolean;
  hydrated: boolean;
}

export function OptionManager({
  options,
  setOptions,
  disabled,
  hydrated,
}: OptionManagerProps) {
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);

  const addOption = (label: string) => {
    const trimmed = label.trim();
    if (!trimmed) return;
    setError(null);
    setOptions((prev) => {
      if (prev.length >= MAX_OPTIONS) {
        setError(copy.wheelFull(MAX_OPTIONS));
        return prev;
      }
      if (prev.some((o) => o.label.toLowerCase() === trimmed.toLowerCase())) {
        setError(copy.duplicateOption(trimmed));
        return prev;
      }
      sounds.pop();
      return [
        ...prev,
        { id: crypto.randomUUID(), label: trimmed, color: nextColor(prev) },
      ];
    });
    setDraft("");
  };

  const loadPreset = (items: string[]) => {
    sounds.pop();
    setOptions(() => {
      const opts: SpinOption[] = [];
      for (const label of items) {
        opts.push({ id: crypto.randomUUID(), label, color: nextColor(opts) });
      }
      return opts;
    });
  };

  const removeOption = (id: string) => {
    setOptions((prev) => prev.filter((o) => o.id !== id));
    setError(null);
  };

  return (
    <Card tone="tinted">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-h3 font-semibold">
          Options{" "}
          <span className="text-small font-normal text-text-muted">
            {options.length}/{MAX_OPTIONS}
          </span>
        </h2>
        {options.length > 0 && (
          <button
            onClick={() => setOptions(() => [])}
            disabled={disabled}
            className="text-xs text-text-muted hover:text-danger transition disabled:opacity-40"
          >
            {copy.clearAll}
          </button>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          addOption(draft);
        }}
        className="flex gap-2 mb-3"
      >
        <input
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            setError(null);
          }}
          disabled={disabled}
          maxLength={40}
          placeholder={copy.optionPlaceholder}
          className="flex-1 min-w-0 rounded-sm border border-border bg-surface px-4 py-2.5 text-base sm:text-small placeholder:text-text-muted/70 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition disabled:opacity-50"
        />
        <Button type="submit" disabled={disabled || !draft.trim()}>
          {copy.add}
        </Button>
      </form>

      {error && <p className="text-xs text-danger mb-3">{error}</p>}

      {hydrated && options.length === 0 && (
        <div className="animate-rise-in">
          <p className="text-small text-text-muted mb-3">{copy.presetsLead}</p>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.name}
                onClick={() => loadPreset(p.items)}
                disabled={disabled}
                className="rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs font-semibold text-text hover:bg-accent-soft hover:border-accent/40 active:scale-95 transition disabled:opacity-40"
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <ul className="space-y-1.5">
        {options.map((o) => (
          <li
            key={o.id}
            className="group flex items-center gap-3 rounded-sm border border-border bg-surface px-3.5 py-2.5 animate-rise-in"
          >
            <span
              className="w-3.5 h-3.5 rounded-full shrink-0"
              style={{ backgroundColor: o.color }}
            />
            <span className="flex-1 min-w-0 truncate text-small">
              {o.label}
            </span>
            <button
              onClick={() => removeOption(o.id)}
              disabled={disabled}
              aria-label={`Remove ${o.label}`}
              className="w-8 h-8 -my-1 flex items-center justify-center rounded-sm text-text-muted/70 hover:text-danger hover:bg-bg transition text-xl leading-none sm:opacity-0 sm:group-hover:opacity-100 disabled:opacity-20"
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </Card>
  );
}
