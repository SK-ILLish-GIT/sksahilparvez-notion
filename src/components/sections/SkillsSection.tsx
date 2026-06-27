import { portfolio } from "@/data";
import type { SkillGroup, SkillItem } from "@/types/portfolio";
import {
  NotionBlock,
  NotionHeading,
  NotionSubheading,
  SectionMeta,
} from "@/components/notion/NotionBlock";
import { FadeIn } from "@/components/notion/FadeIn";
import {
  SKILLS_INNER_X,
  SECTION_SCROLL_MT,
  SURFACE_ELEVATED,
} from "@/lib/layout";
import { cn } from "@/lib/utils";

function SkillTile({ skill }: { skill: SkillItem }) {
  return (
    <div
      data-cursor-hint={skill.name}
      className="inline-flex max-w-full items-center gap-1.5 rounded-md border border-border/60 bg-muted/20 px-2 py-1 text-[11px] leading-tight transition-colors hover:bg-notion-hover"
    >
      <img
        src={skill.logo}
        alt=""
        loading="lazy"
        className="h-3.5 w-3.5 shrink-0 object-contain dark:invert dark:brightness-200"
      />
      <span className="truncate">{skill.name}</span>
    </div>
  );
}

function SkillGalleryGroup({ group }: { group: SkillGroup }) {
  return (
    <div>
      <div className="mb-2 flex items-baseline gap-1.5">
        <NotionSubheading className="mb-0 text-xs">
          {group.label}
        </NotionSubheading>
        <span className="text-[10px] tabular-nums text-muted-foreground">
          {group.items.length}
        </span>
      </div>
      <ul className="flex flex-wrap gap-1.5">
        {group.items.map((skill) => (
          <li key={skill.name}>
            <SkillTile skill={skill} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SkillsSection() {
  return (
    <FadeIn>
      <section id="skills" className={SECTION_SCROLL_MT}>
        <NotionBlock>
          <NotionHeading>Skills</NotionHeading>
          <SectionMeta label="Gallery" />
        </NotionBlock>

        <div
          className={cn(
            "mt-4 space-y-4 rounded-lg border border-border bg-card",
            SURFACE_ELEVATED,
            SKILLS_INNER_X,
          )}
        >
          {portfolio.skills.map((group) => (
            <SkillGalleryGroup key={group.id} group={group} />
          ))}
        </div>
      </section>
    </FadeIn>
  );
}
