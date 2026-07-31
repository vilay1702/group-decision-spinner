import type { Metadata } from "next";
import { TOOL_NAME } from "@/lib/brand";
import { StaticPage, StaticSection } from "@/components/ui/StaticPage";

export const metadata: Metadata = {
  title: `Privacy · ${TOOL_NAME}`,
  description: `How ${TOOL_NAME} handles your data: everything stays in your browser.`,
  alternates: { canonical: "/privacy/" },
  openGraph: {
    title: `Privacy · ${TOOL_NAME}`,
    description: `How ${TOOL_NAME} handles your data: everything stays in your browser.`,
    url: "/privacy/",
    type: "website",
  },
};

export default function PrivacyPage() {
  return (
    <StaticPage h1="Privacy">
      <StaticSection heading="The short version">
        <p>
          Everything runs in your browser. Your options, spin history, and
          settings are never uploaded — we couldn’t read them if we wanted to.
        </p>
      </StaticSection>

      <StaticSection heading="What's stored, and where">
        <p>
          {TOOL_NAME} saves five things in your browser’s local storage, so
          your wheel survives a refresh: your list of options, your spin
          history, whether sounds are muted, your light-or-dark theme
          choice, and the random analytics identifier described below.
        </p>
        <p>
          Apart from the analytics identifier, that data lives only on your
          device. It’s not sent to a server, and
          it isn’t shared between your devices or browsers.
        </p>
      </StaticSection>

      <StaticSection heading="No accounts, no third-party trackers">
        <p>
          There’s nothing to sign up for, and no third-party trackers,
          advertising pixels, or cookies. We count usage on our own
          self-hosted analytics: pages visited, tools used, your browser
          and operating system type, and your approximate location
          (country and city, estimated from your IP address — the address
          itself is never stored).
        </p>
        <p>
          To tell returning visitors apart, a random identifier is kept in
          your browser’s local storage. It says nothing about who you are,
          and clearing this site’s data removes it. If your browser sends
          Do Not Track, we don’t count you at all.
        </p>
      </StaticSection>

      <StaticSection heading="Clearing your data">
        <p>
          Use “Clear all” to empty the wheel, or clear this site’s data in
          your browser settings to remove everything at once. Gone means gone
          — there’s no copy anywhere else.
        </p>
      </StaticSection>
    </StaticPage>
  );
}
