import { useState } from "react";
import { portfolio } from "@/data";
import { BookmarkBlock } from "@/components/notion/BookmarkBlock";
import {
  NotionBlock,
  NotionHeading,
  NotionSubheading,
} from "@/components/notion/NotionBlock";
import { FadeIn } from "@/components/notion/FadeIn";
import { CalEmbed } from "@/components/booking/CalEmbed";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ContactSectionProps {
  bookOpen: boolean;
  onBookOpenChange: (open: boolean) => void;
}

export function ContactSection({
  bookOpen,
  onBookOpenChange,
}: ContactSectionProps) {
  const [showEmbed, setShowEmbed] = useState(false);

  return (
    <FadeIn>
      <section id="contact" className="scroll-mt-8 pt-12 pb-16">
        <NotionBlock>
          <NotionHeading>Contact</NotionHeading>
          <p className="mt-1 text-xs text-muted-foreground">
            Bookmarks + Embed
          </p>
        </NotionBlock>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {portfolio.contact.map((link) => (
            <BookmarkBlock
              key={link.label}
              href={link.href}
              label={link.label}
              value={link.value}
            />
          ))}
        </div>

        <div className="mt-8">
          <NotionBlock showHandle={false}>
            <NotionSubheading>Book a meeting</NotionSubheading>
            <p className="mt-1 text-sm text-muted-foreground">
              Pick a time that works — powered by Cal.com
            </p>
          </NotionBlock>

          <div className="mt-3 hidden md:block">
            {showEmbed ? (
              <CalEmbed />
            ) : (
              <button
                onClick={() => setShowEmbed(true)}
                data-cursor-hint="Load Cal.com booking calendar"
                className="flex w-full items-center justify-center rounded-md border border-dashed border-border py-16 text-sm text-muted-foreground transition-colors hover:bg-notion-hover hover:text-foreground"
              >
                Click to load calendar embed
              </button>
            )}
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground md:hidden">
            Tap &quot;Book a call&quot; in the header to schedule on mobile.
          </p>
        </div>

        <footer className="mt-12 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          Last updated {portfolio.site.lastUpdated} · Built with React &
          shadcn/ui
        </footer>
      </section>

      <Dialog open={bookOpen} onOpenChange={onBookOpenChange}>
        <DialogContent className="max-w-3xl gap-0 overflow-hidden p-0">
          <CalEmbed className="border-0" />
        </DialogContent>
      </Dialog>
    </FadeIn>
  );
}
