import type { Metadata } from "next";
import { TOOL_NAME } from "@/lib/brand";
import { StaticPage, StaticSection } from "@/components/ui/StaticPage";

export const metadata: Metadata = {
  title: `Privacy · ${TOOL_NAME}`,
  description: `How ${TOOL_NAME} handles your data: everything stays in your browser.`,
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
          {TOOL_NAME} saves three things in your browser’s local storage, so
          your wheel survives a refresh: your list of options, your spin
          history, and whether sounds are muted.
        </p>
        <p>
          That data lives only on your device. It’s not sent to a server, and
          it isn’t shared between your devices or browsers.
        </p>
      </StaticSection>

      <StaticSection heading="No accounts, no trackers">
        <p>
          There’s nothing to sign up for, and we don’t use analytics trackers,
          advertising pixels, or cookies.
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
