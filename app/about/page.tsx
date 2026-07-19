import type { Metadata } from "next";
import { ENDORSEMENT, MAKER_CREDIT, TAGLINE, TOOL_NAME } from "@/lib/brand";
import { StaticPage, StaticSection } from "@/components/ui/StaticPage";

export const metadata: Metadata = {
  title: `About · ${TOOL_NAME}`,
  description: `What ${TOOL_NAME} is, how it works, and who makes it.`,
  alternates: { canonical: "/about/" },
  openGraph: {
    title: `About · ${TOOL_NAME}`,
    description: `What ${TOOL_NAME} is, how it works, and who makes it.`,
    url: "/about/",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <StaticPage h1={`About ${TOOL_NAME}`}>
      <StaticSection heading="What it is">
        <p>
          {TOOL_NAME} is a free spinning wheel for settling group decisions —
          where to eat, what to watch, who goes first. Add your options, spin,
          and let fate take the blame.
        </p>
        <p>
          There’s no signup and nothing to install. It runs entirely in your
          browser, and your options never leave your device.
        </p>
      </StaticSection>

      <StaticSection heading="Is it fair?">
        <p>
          Yes. Every spin starts with a random velocity and coasts to a stop
          under a physics simulation, so no slice is favored. You can flick
          the wheel yourself — strength and direction are yours, but the
          outcome is anyone’s guess.
        </p>
      </StaticSection>

      <StaticSection heading="Who makes it">
        <p>
          {/* Family positioning (§1) — the endorsement line joins once the
              parent brand is decided. */}
          {TOOL_NAME}
          {ENDORSEMENT ? ` is ${ENDORSEMENT} —` : " is part of"} a family of
          free single-purpose web tools. {TAGLINE} No clutter, no accounts, no
          uploads.
        </p>
        <p>{MAKER_CREDIT}</p>
      </StaticSection>
    </StaticPage>
  );
}
