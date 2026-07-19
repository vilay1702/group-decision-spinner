/**
 * Brand constants — code mirror of "Branded Web Tools.md" v2 (repo root).
 * That file is the source of truth; change values there first, then here.
 *
 * v2 model: one parent brand, many products. The tool is the hero (its own
 * name, own accent, own personality); the parent is the endorser, appearing
 * only as "from [Parent]". This tool's claimed accent is Amber — the family
 * palette row for "Fun & decisions".
 */

/**
 * TODO in the brand doc (§1). Once decided, set the name here and the
 * endorsement lockup, footer, OG image, and "More tools" heading pick it up.
 */
export const PARENT_BRAND: string | null = null;

/** Endorsement line (§1) — exactly this phrasing, never "Powered by". */
export const ENDORSEMENT = PARENT_BRAND ? `from ${PARENT_BRAND}` : null;

/** Maker credit (§1/§6) — footer of every tool, muted small text, own line. */
export const MAKER_CREDIT = "Made with ♥ by Vilay";

/** Parent tagline (§1). */
export const TAGLINE = "Free, fast tools that run in your browser.";

export const TOOL_NAME = "Decision Spinner";

/** Canonical origin — must match public/CNAME. Used for metadataBase, sitemap, robots, JSON-LD. */
export const SITE_URL = "https://spin.vilaybende.com";

/** <title> — keyword-targeted ("spin the wheel" / "wheel spinner"), brand last. */
export const PAGE_TITLE = "Spin the Wheel — Free Wheel Spinner | Decision Spinner";

/**
 * Meta/OG/JSON-LD description — keyword-targeted for search snippets.
 * The visible on-page tagline stays TOOL_DESCRIPTION.
 */
export const META_DESCRIPTION =
  "Free wheel spinner for random picks and group decisions. Add options, spin the wheel, and get a fair winner. No signup, nothing uploaded, works on any device.";

/** Exactly one H1 per page — the tool's keyword-targeted description (§4). */
export const TOOL_H1 = "Group decision spinner";
export const TOOL_DESCRIPTION =
  "Add your options, spin the wheel, and let fate settle it. No signup, nothing uploaded.";

/**
 * Raw palette values for surfaces CSS variables can't reach
 * (OG images, SVG). Everything else consumes the tokens in globals.css.
 *
 * Accent = Red, this tool's ONE claimed accent (§3).
 */
export const BRAND_COLORS = {
  accent: "#DC2626",
  accentHover: "#B91C1C",
  accentSoft: "#FEF2F2",
  bg: "#FAFAF9",
  surface: "#FFFFFF",
  border: "#E7E5E4",
  text: "#1C1917",
  textMuted: "#78716C",
} as const;
