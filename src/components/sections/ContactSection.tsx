import { portfolio } from "@/data";
import { CalBookingButton } from "@/components/booking/CalBookingButton";
import { BookmarkBlock } from "@/components/notion/BookmarkBlock";
import { NotionBlock, NotionHeading } from "@/components/notion/NotionBlock";
import { FadeIn } from "@/components/notion/FadeIn";
import { CONTACT_GRID, SECTION_SCROLL_MT } from "@/lib/layout";
import { cn } from "@/lib/utils";

export function ContactSection() {
  return (
    <FadeIn>
      <section id="contact" className={SECTION_SCROLL_MT}>
        <NotionBlock>
          <NotionHeading>Contact</NotionHeading>
          <p className="mt-1 text-xs text-muted-foreground">Bookmarks</p>
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

        <footer className="mt-12 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          Last updated {portfolio.site.lastUpdated} · Built with React &
          shadcn/ui
        </footer>
      </section>
    </FadeIn>
  );
}
