import { ImageResponse } from "next/og";
import {
  BRAND_COLORS,
  ENDORSEMENT,
  TAGLINE,
  TOOL_H1,
  TOOL_NAME,
} from "@/lib/brand";

// Required for `output: "export"` — the image is generated at build time.
export const dynamic = "force-static";

export const alt = TOOL_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Brand OG template ("Branded Web Tools.md" §8): brand bg, tool name + icon
 * in the tool's own accent, `from [Parent]` bottom-left in muted text.
 * One template for all tools — only name/icon/accent vary.
 * (Until the parent brand is decided, the tagline holds the bottom-left slot.)
 */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          backgroundColor: BRAND_COLORS.bg,
          color: BRAND_COLORS.text,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* The tool's icon — same construction-kit artwork as app/icon.svg */}
          <svg
            width={96}
            height={96}
            viewBox="0 0 64 64"
            style={{ marginBottom: 44 }}
          >
            <rect width="64" height="64" rx="20" fill={BRAND_COLORS.accent} />
            <g stroke="#fff" strokeWidth="4" strokeLinecap="round">
              <circle cx="32" cy="32" r="17" fill="none" />
              <line x1="32" y1="15" x2="32" y2="49" />
              <line x1="46.7" y1="23.5" x2="17.3" y2="40.5" />
              <line x1="46.7" y1="40.5" x2="17.3" y2="23.5" />
            </g>
            <circle cx="32" cy="32" r="5" fill="#fff" />
          </svg>
          <div
            style={{
              fontSize: 84,
              fontWeight: 700,
              letterSpacing: -2,
              color: BRAND_COLORS.accent,
            }}
          >
            {TOOL_NAME}
          </div>
          <div
            style={{
              fontSize: 34,
              marginTop: 18,
              color: BRAND_COLORS.textMuted,
            }}
          >
            {`${TOOL_H1[0].toUpperCase() + TOOL_H1.slice(1)} — free, in your browser`}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 30,
            color: BRAND_COLORS.textMuted,
          }}
        >
          {ENDORSEMENT ?? TAGLINE}
        </div>
      </div>
    ),
    size,
  );
}
