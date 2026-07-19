import Link from "next/link";
import { ENDORSEMENT, TOOL_NAME } from "@/lib/brand";
import { Mark } from "./Mark";

/** Shared chrome: tool wordmark (the hero) + endorsement lockup (§2). */
export function SiteHeader() {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex h-16 max-w-5xl items-center px-4">
        <Link href="/" className="flex items-baseline gap-2.5">
          <Mark className="self-center" />
          <span className="font-display text-body font-bold tracking-[-0.02em]">
            {TOOL_NAME}
          </span>
          {/* Endorsement lockup (§2): UI font, 500, muted — never louder
              than the tool name. Appears once the parent brand is decided. */}
          {ENDORSEMENT && (
            <span className="text-small font-medium text-text-muted">
              {ENDORSEMENT}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
