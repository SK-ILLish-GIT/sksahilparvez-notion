import { useEffect, useRef, useState } from "react";
import { portfolio } from "@/data";
import { SocialLinkButton } from "@/components/ui/BrandLogo";
import { Button } from "@/components/ui/button";
import { SOCIAL_LOGOS } from "@/lib/social-logos";
import { cn } from "@/lib/utils";
import { Share2 } from "lucide-react";

const socialLinks = [
  {
    href: portfolio.site.github,
    label: "GitHub",
    logo: SOCIAL_LOGOS.github,
    hint: "Visit GitHub profile",
  },
  {
    href: portfolio.site.linkedin,
    label: "LinkedIn",
    logo: SOCIAL_LOGOS.linkedin,
    hint: "Visit LinkedIn profile",
  },
  {
    href: portfolio.site.whatsapp,
    label: "WhatsApp",
    logo: SOCIAL_LOGOS.whatsapp,
    hint: "Message on WhatsApp",
  },
  {
    href: portfolio.site.twitter,
    label: "X",
    logo: SOCIAL_LOGOS.x,
    hint: "Visit X profile",
  },
] as const;

export function ContactSocialDialog() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <Button
        type="button"
        variant="notion"
        size="icon"
        className="h-9 w-9 shrink-0 shadow-sm"
        aria-label="Contact"
        aria-expanded={open}
        aria-haspopup="menu"
        data-cursor-hint="Open social links"
        onClick={() => setOpen((value) => !value)}
      >
        <Share2 className="h-4 w-4" />
      </Button>

      <div
        role="menu"
        aria-label="Contact"
        className={cn(
          "absolute right-0 top-[calc(100%+0.5rem)] z-50 min-w-[2.75rem] rounded-lg border border-border bg-background p-2 shadow-lg",
          "origin-top-right transition-all duration-150",
          open
            ? "pointer-events-auto scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0",
        )}
      >
        <div className="flex flex-col items-center gap-1.5">
          {socialLinks.map((link) => (
            <SocialLinkButton
              key={link.label}
              href={link.href}
              label={link.label}
              logo={link.logo}
              hint={link.hint}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
