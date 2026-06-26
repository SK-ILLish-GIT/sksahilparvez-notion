import { portfolio } from "@/data";
import { CalloutBlock } from "@/components/notion/CalloutBlock";
import { NotionBlock, NotionHeading } from "@/components/notion/NotionBlock";
import { FadeIn } from "@/components/notion/FadeIn";

export function AchievementsSection() {
  return (
    <FadeIn>
      <section id="achievements" className="scroll-mt-8 pt-12">
        <NotionBlock>
          <NotionHeading>Competitive Programming</NotionHeading>
          <p className="mt-1 text-xs text-muted-foreground">
            Database · Table view
          </p>
        </NotionBlock>

        <div className="mt-3">
          <CalloutBlock icon="🏆" variant="yellow">
            Solved 1600+ DSA and competitive programming problems across
            platforms.
          </CalloutBlock>
        </div>

        <div className="mt-4 overflow-x-auto rounded-md border border-border">
          <table className="w-full min-w-[480px] text-sm">
            <thead>
              <tr className="border-b border-border bg-accent/30 text-left text-xs text-muted-foreground">
                <th className="px-4 py-2.5 font-medium">Platform</th>
                <th className="px-4 py-2.5 font-medium">Rating</th>
                <th className="px-4 py-2.5 font-medium">Best rank</th>
                <th className="px-4 py-2.5 font-medium">Handle</th>
              </tr>
            </thead>
            <tbody>
              {portfolio.achievements
                .filter((a) => !a.highlight)
                .map((row) => (
                  <tr
                    key={row.platform}
                    className="border-b border-border last:border-0 transition-colors hover:bg-notion-hover"
                  >
                    <td className="px-4 py-3 font-medium">{row.platform}</td>
                    <td className="px-4 py-3">{row.rating}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {row.bestRank}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-primary">
                      {row.handle}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>
    </FadeIn>
  );
}
