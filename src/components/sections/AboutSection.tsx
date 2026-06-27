import { portfolio } from "@/data";
import {
  NotionBlock,
  NotionHeading,
  SectionMeta,
} from "@/components/notion/NotionBlock";
import { CalloutBlock } from "@/components/notion/CalloutBlock";
import { FadeIn } from "@/components/notion/FadeIn";
import { SECTION_SCROLL_MT } from "@/lib/layout";

export function AboutSection() {
  return (
    <FadeIn>
      <section id="about" className={SECTION_SCROLL_MT}>
        <NotionBlock>
          <NotionHeading>About</NotionHeading>
          <SectionMeta kind="Page" label="Callout" />
        </NotionBlock>
        <div className="mt-3 space-y-3">
          <CalloutBlock icon="💡" title="About me" variant="blue">
            {portfolio.profile.summary}
          </CalloutBlock>
          <CalloutBlock icon="🎯" title="Currently building" variant="yellow">
            Analytics scorecards, blueprint-based visualizations, and
            CRM-integrated data views at Highspot — turning reports into
            interactive charts and tables.
          </CalloutBlock>
        </div>
      </section>
    </FadeIn>
  );
}
