import { portfolio } from "@/data";
import { CalBookingButton } from "@/components/booking/CalBookingButton";
import { BookmarkBlock } from "@/components/notion/BookmarkBlock";
import {
  NotionBlock,
  NotionHeading,
  SectionMeta,
} from "@/components/notion/NotionBlock";
import { FadeIn } from "@/components/notion/FadeIn";
import { CONTACT_GRID, SECTION_SCROLL_MT } from "@/lib/layout";
import { cn } from "@/lib/utils";

export function ContactSection() {
  return (
    <FadeIn>
      <section id="contact" className={SECTION_SCROLL_MT}>
        <NotionBlock>
          <NotionHeading>Contact</NotionHeading>
          <SectionMeta label="Bookmarks" />
        </NotionBlock>

        <div className={cn("mt-4", CONTACT_GRID)}>
          {portfolio.contact.map((link) => (
            <BookmarkBlock
              key={link.label}
              href={link.href}
              label={link.label}
              value={link.value}
              logo={link.logo}
            />
          ))}
          <CalBookingButton layout="card" />
        </div>
      </section>
    </FadeIn>
  );
}
