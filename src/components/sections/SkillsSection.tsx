import { portfolio } from "@/data";
import { Badge } from "@/components/ui/badge";
import {
  NotionBlock,
  NotionHeading,
  NotionSubheading,
} from "@/components/notion/NotionBlock";
import { FadeIn } from "@/components/notion/FadeIn";

export function SkillsSection() {
  return (
    <FadeIn>
      <section id="skills" className="scroll-mt-8 pt-12">
        <NotionBlock>
          <NotionHeading>Skills</NotionHeading>
          <p className="mt-1 text-xs text-muted-foreground">
            Database · Board view
          </p>
        </NotionBlock>

        <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
          {portfolio.skills.map((group) => (
            <div
              key={group.id}
              className="w-52 shrink-0 rounded-lg border border-border bg-card"
            >
              <div className="px-3 py-2">
                <NotionSubheading className="mb-0">
                  {group.label}
                </NotionSubheading>
                <p className="text-[10px] text-muted-foreground">
                  {group.items.length} items
                </p>
              </div>
              <div className="space-y-1.5 p-2">
                {group.items.map((skill) => (
                  <div
                    key={skill}
                    data-cursor-hint="Skill tag"
                    className="rounded-md border border-border bg-background px-2.5 py-2 text-sm shadow-sm transition-transform hover:-translate-y-0.5 hover:bg-notion-hover"
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5 md:hidden">
          {portfolio.skills.flatMap((g) =>
            g.items.map((s) => (
              <Badge key={s} variant="tag">
                {s}
              </Badge>
            )),
          )}
        </div>
      </section>
    </FadeIn>
  );
}
