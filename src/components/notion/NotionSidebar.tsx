import { useEffect, useState } from "react";
import { portfolio } from "@/data";
import { getDisplayStatus } from "@/lib/easter-eggs/status";
import { CalBookingButton } from "@/components/booking/CalBookingButton";
import { SocialLinkButton } from "@/components/ui/BrandLogo";
import { scrollToSection } from "@/lib/utils";
import { SOCIAL_LOGOS } from "@/lib/social-logos";
import { cn } from "@/lib/utils";
import { ChevronRight, Menu, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "@/components/theme-provider";

interface NotionSidebarProps {
  activeSection: string;
}

function ProfileAvatar({ size = "md" }: { size?: "sm" | "md" }) {
  const { profile } = portfolio;
  const boxClass = size === "sm" ? "h-7 w-7" : "h-9 w-9";

  if (profile.avatar) {
    return (
      <div
        className={cn(
          "relative shrink-0 overflow-hidden rounded-md ring-1 ring-border",
          boxClass,
        )}
      >
        <img
          src={profile.avatar}
          alt=""
          className="absolute left-1/2 top-1/2 h-[108%] w-[108%] max-w-none -translate-x-1/2 -translate-y-1/2 object-cover object-[center_22%]"
        />
      </div>
    );
  }

  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-md bg-muted/50 ring-1 ring-border",
        boxClass,
        size === "sm" ? "text-base" : "text-lg",
      )}
    >
      {profile.pageIcon}
    </span>
  );
}

function SidebarWorkspaceHeader({
  onNavigate,
  inSheet,
}: {
  onNavigate?: () => void;
  inSheet?: boolean;
}) {
  const { profile, site } = portfolio;
  const statusProp = profile.properties.find((p) => p.type === "status");

  return (
    <div className="shrink-0 border-b border-border bg-gradient-to-b from-muted/20 to-transparent">
      <button
        type="button"
        data-cursor-hint="Go to home"
        onClick={() => {
          scrollToSection("hero");
          onNavigate?.();
        }}
        className={cn(
          "group flex w-full items-start gap-3 px-3 py-3 text-left transition-colors hover:bg-notion-hover",
          inSheet && "pr-12",
        )}
      >
        <ProfileAvatar />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold leading-tight text-foreground">
            {profile.name}
          </p>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {profile.title}
          </p>
          {statusProp && (
            <span className="mt-1.5 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
              {getDisplayStatus(statusProp.value)}
            </span>
          )}
        </div>
        {!inSheet && (
          <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:text-muted-foreground" />
        )}
      </button>

      <div className="mx-3 mb-3 flex items-center gap-1.5 rounded-md border border-border/60 bg-background/50 px-2.5 py-1.5 shadow-sm">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Workspace
        </span>
        <span className="text-muted-foreground/40">·</span>
        <span className="truncate text-[11px] font-medium text-foreground/90">
          {site.workspaceName}
        </span>
      </div>
    </div>
  );
}

function SidebarNav({
  activeSection,
  onNavigate,
}: NotionSidebarProps & { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-0.5 px-2 pb-2">
      <p className="px-2 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        Pages
      </p>
      {portfolio.sections.map((section) => {
        const isActive = activeSection === section.id;

        return (
          <button
            key={section.id}
            data-cursor-hint={`Go to ${section.label}`}
            onClick={() => {
              scrollToSection(section.id);
              onNavigate?.();
            }}
            className={cn(
              "flex items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-sm transition-all",
              isActive
                ? "bg-notion-hover font-medium text-foreground shadow-sm ring-1 ring-border/50"
                : "text-muted-foreground hover:bg-notion-hover hover:text-foreground",
            )}
          >
            <span
              className={cn(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-sm text-sm leading-none transition-colors",
                isActive
                  ? "bg-emerald-500/15 ring-1 ring-emerald-500/20"
                  : "bg-muted/40",
              )}
            >
              {section.icon}
            </span>
            <span className="truncate">{section.label}</span>
            {isActive && (
              <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
            )}
          </button>
        );
      })}
    </nav>
  );
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      className="grid w-full grid-cols-2 gap-1 rounded-lg border border-border bg-muted/40 p-1"
      role="group"
      aria-label="Theme"
    >
      <button
        type="button"
        onClick={() => theme === "dark" && toggleTheme()}
        data-cursor-hint="Switch to light mode"
        aria-pressed={theme === "light"}
        className={cn(
          "flex h-8 items-center justify-center gap-1.5 rounded-md text-xs font-medium transition-all",
          theme === "light"
            ? "bg-background text-foreground shadow-sm ring-1 ring-border/60"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        <Sun className="h-3.5 w-3.5" />
        Light
      </button>
      <button
        type="button"
        onClick={() => theme === "light" && toggleTheme()}
        data-cursor-hint="Switch to dark mode"
        aria-pressed={theme === "dark"}
        className={cn(
          "flex h-8 items-center justify-center gap-1.5 rounded-md text-xs font-medium transition-all",
          theme === "dark"
            ? "bg-background text-foreground shadow-sm ring-1 ring-border/60"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        <Moon className="h-3.5 w-3.5" />
        Dark
      </button>
    </div>
  );
}

function SidebarFooter() {
  const { site } = portfolio;

  const socialLinks = [
    { href: site.github, label: "GitHub", logo: SOCIAL_LOGOS.github },
    { href: site.linkedin, label: "LinkedIn", logo: SOCIAL_LOGOS.linkedin },
    { href: site.whatsapp, label: "WhatsApp", logo: SOCIAL_LOGOS.whatsapp },
    { href: site.twitter, label: "X", logo: SOCIAL_LOGOS.x },
  ] as const;

  return (
    <div className="shrink-0">
      <p className="px-3 py-2 text-xs text-muted-foreground">
        Press{" "}
        <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">
          ⌘K
        </kbd>{" "}
        to search
      </p>
      <div className="space-y-2.5 border-t border-border p-3">
        <div className="grid w-full grid-cols-4 justify-items-center gap-1">
          {socialLinks.map((link) => (
            <SocialLinkButton
              key={link.label}
              href={link.href}
              label={link.label}
              logo={link.logo}
              hint={`Visit ${link.label}`}
            />
          ))}
        </div>
        <CalBookingButton layout="full" />
        <ThemeToggle />
      </div>
    </div>
  );
}

/** Fixed left sidebar — desktop only */
export function NotionSidebar({ activeSection }: NotionSidebarProps) {
  return (
    <aside className="fixed left-0 top-0 z-30 hidden h-screen w-60 flex-col overflow-hidden border-r border-border bg-notion-sidebar md:flex">
      <SidebarWorkspaceHeader />
      <div className="min-h-0 flex-1 overflow-y-auto">
        <SidebarNav activeSection={activeSection} />
      </div>
      <SidebarFooter />
    </aside>
  );
}

/** Top bar + slide-out nav — mobile only */
export function MobileNavBar({ activeSection }: NotionSidebarProps) {
  const { theme, toggleTheme } = useTheme();
  const { profile } = portfolio;
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 flex w-full items-center justify-between border-b border-border bg-background/95 px-3 py-2.5 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:hidden">
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Open navigation">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="flex h-full w-[min(100vw-2rem,18rem)] flex-col p-0"
        >
          <SidebarWorkspaceHeader
            inSheet
            onNavigate={() => setMobileOpen(false)}
          />
          <div className="min-h-0 flex-1 overflow-y-auto">
            <SidebarNav
              activeSection={activeSection}
              onNavigate={() => setMobileOpen(false)}
            />
          </div>
          <div className="mt-auto">
            <SidebarFooter />
          </div>
        </SheetContent>
      </Sheet>

      <button
        type="button"
        onClick={() => scrollToSection("hero")}
        className="flex min-w-0 items-center gap-2 rounded-md px-1 py-0.5 transition-colors hover:bg-notion-hover"
      >
        <ProfileAvatar size="sm" />
        <span className="truncate text-sm font-semibold">{profile.name}</span>
      </button>

      <div className="flex shrink-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === "light" ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
        </Button>
      </div>
    </header>
  );
}

export function useActiveSection() {
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const ids = portfolio.sections.map((s) => s.id);

    const updateActiveSection = () => {
      const viewportHeight = window.innerHeight;
      const marker = viewportHeight * 0.32;
      const maxScroll = document.documentElement.scrollHeight - viewportHeight;
      const atBottom = window.scrollY >= maxScroll - 2;

      // At document bottom, trailing sections never reach the marker line
      if (atBottom) {
        for (let i = ids.length - 1; i >= 0; i--) {
          const el = document.getElementById(ids[i]);
          if (!el) continue;
          const { top, bottom } = el.getBoundingClientRect();
          if (bottom > 0 && top < viewportHeight) {
            setActiveSection(ids[i]);
            return;
          }
        }
      }

      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= marker) {
          current = id;
        }
      }

      // Trailing sections: visible but top stays below marker — not enough scroll left
      const remainingScroll = maxScroll - window.scrollY;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const { top, bottom } = el.getBoundingClientRect();
        if (top <= marker || bottom <= 0 || top >= viewportHeight) continue;
        if (top - marker > remainingScroll + 2) {
          current = id;
        }
      }

      setActiveSection(current);
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, []);

  return activeSection;
}
