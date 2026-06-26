import { portfolio } from "@/data";
import { NotionBlock, NotionHeading } from "@/components/notion/NotionBlock";
import { CalloutBlock } from "@/components/notion/CalloutBlock";
import { FadeIn } from "@/components/notion/FadeIn";

export function AboutSection() {
  return (
    <FadeIn>
      <section id="about" className="scroll-mt-8 pt-12">
        <NotionBlock>
          <NotionHeading>About</NotionHeading>
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
