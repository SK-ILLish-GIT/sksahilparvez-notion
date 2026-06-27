import { portfolio } from "@/data";
import { CalBookingButton } from "@/components/booking/CalBookingButton";
import { ContactSocialDialog } from "@/components/contact/ContactSocialDialog";
import { PropertyPill } from "@/components/notion/PropertyPill";
import {
  HERO_AVATAR_OFFSET,
  HERO_COVER,
  HERO_TITLE,
  PAGE_X,
  PROPERTY_PILL_GRID,
} from "@/lib/layout";
import { cn } from "@/lib/utils";
import { FileText } from "lucide-react";

const HERO_ACTION_CLASS =
  "h-9 min-w-[10.25rem] justify-center px-4 text-sm font-semibold shadow-sm";

export function PageHeader() {
  const { profile, site } = portfolio;

  return (
    <section id="hero" className="scroll-mt-4">
      <div className={HERO_COVER}>
        <div
          className="h-full w-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url("${encodeURI(site.coverImage)}")` }}
          role="img"
          aria-label="SK Sahil Parvez banner"
        />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className={cn("mx-auto max-w-[900px]", PAGE_X)}>
        <div className={HERO_AVATAR_OFFSET}>
          <div className="mb-4 inline-flex rounded-md bg-background p-1.5 text-5xl leading-none shadow-sm ring-1 ring-border">
            {profile.pageIcon}
          </div>

          <h1 className={cn(HERO_TITLE, "text-foreground")}>{profile.name}</h1>
          <p className="mt-1 text-lg text-muted-foreground">{profile.title}</p>
          <p className="mt-3 text-sm text-muted-foreground">
            {profile.tagline}
          </p>

          <div className={cn("mt-6", PROPERTY_PILL_GRID)}>
            {profile.properties.map((prop) => (
              <PropertyPill
                key={prop.label}
                label={prop.label}
                value={prop.value}
                type={prop.type}
              />
            ))}
          </div>

          <div className="mt-6 flex items-center gap-2">
            <CalBookingButton className={HERO_ACTION_CLASS} />
            <a
              href={site.cvPath}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-hint="View résumé on Google Drive"
              className={`inline-flex items-center gap-2 rounded-md bg-[#DC2626] text-white transition-opacity hover:opacity-90 ${HERO_ACTION_CLASS}`}
            >
              <FileText className="h-4 w-4 shrink-0" />
              Résumé
            </a>
            <div className="ml-auto shrink-0">
              <ContactSocialDialog />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
