import type { ReactNode } from "react";
import { portfolio } from "@/data";
import { Button } from "@/components/ui/button";
import { PropertyPill } from "@/components/notion/PropertyPill";
import { FileText, Github, Linkedin } from "lucide-react";
import { cn } from "@/lib/utils";

function SocialButton({
  href,
  label,
  icon,
  className,
  hint,
}: {
  href: string;
  label: string;
  icon: ReactNode;
  className: string;
  hint: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      data-cursor-hint={hint}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-md text-white transition-opacity hover:opacity-90",
        className,
      )}
    >
      {icon}
    </a>
  );
}

export function PageHeader({ onBookCall }: { onBookCall: () => void }) {
  const { profile, site } = portfolio;

  return (
    <section id="hero" className="scroll-mt-4">
      <div className="relative h-44 w-full sm:h-52 md:h-60">
        <div
          className="h-full w-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url("${encodeURI(site.coverImage)}")` }}
          role="img"
          aria-label="SK Sahil Parvez banner"
        />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="mx-auto max-w-[900px] px-6 sm:px-12">
        <div className="relative -mt-12 sm:-mt-14">
          <div className="mb-4 inline-flex rounded-md bg-background p-1.5 text-5xl leading-none shadow-sm ring-1 ring-border">
            {profile.pageIcon}
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {profile.name}
          </h1>
          <p className="mt-1 text-lg text-muted-foreground">{profile.title}</p>
          <p className="mt-3 text-sm text-muted-foreground">
            {profile.tagline}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {profile.properties.map((prop) => (
              <PropertyPill
                key={prop.label}
                label={prop.label}
                value={prop.value}
                type={prop.type}
              />
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <Button onClick={onBookCall} data-cursor-hint="Schedule a meeting">
              📅 Book a call
            </Button>
            <a
              href={site.cvPath}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-hint="View CV on Google Drive"
              className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-[#DC2626] px-4 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              <FileText className="h-4 w-4" />
              CV
            </a>
            <SocialButton
              href={site.github}
              label="GitHub"
              hint="Visit GitHub profile"
              icon={<Github className="h-4 w-4" />}
              className="bg-[#24292f]"
            />
            <SocialButton
              href={site.linkedin}
              label="LinkedIn"
              hint="Visit LinkedIn profile"
              icon={<Linkedin className="h-4 w-4" />}
              className="bg-[#0A66C2]"
            />
            <SocialButton
              href={site.twitter}
              label="X"
              hint="Visit X profile"
              icon={
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              }
              className="bg-black dark:bg-white dark:text-black"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
