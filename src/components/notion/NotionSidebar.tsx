import { useEffect, useState } from "react";
import { portfolio } from "@/data";
import { scrollToSection } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Menu, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "@/components/theme-provider";

interface NotionSidebarProps {
  activeSection: string;
  onBookCall: () => void;
}

export function NotionSidebar({
  activeSection,
  onBookCall,
}: NotionSidebarProps) {
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const nav = (
    <nav className="flex flex-col gap-0.5 p-2">
      {portfolio.sections.map((section) => (
        <button
          key={section.id}
          data-cursor-hint={`Go to ${section.label}`}
          onClick={() => {
            scrollToSection(section.id);
            setMobileOpen(false);
          }}
          className={cn(
            "flex items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm transition-colors",
            activeSection === section.id
              ? "bg-notion-hover font-medium text-foreground"
              : "text-muted-foreground hover:bg-notion-hover hover:text-foreground",
          )}
        >
          <span className="text-base leading-none">{section.icon}</span>
          <span className="truncate">{section.label}</span>
        </button>
      ))}
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar — fixed in place, does not scroll with page */}
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-60 flex-col overflow-hidden border-r border-border bg-notion-sidebar md:flex">
        <div className="shrink-0 border-b border-border px-4 py-4">
          <p className="text-xs font-medium text-muted-foreground">Workspace</p>
          <p className="mt-0.5 truncate text-sm font-semibold">
            {portfolio.site.workspaceName}
          </p>
        </div>
        <div className="min-h-0 flex-1 overflow-hidden py-2">{nav}</div>
        <div className="shrink-0 border-t border-border space-y-2 p-3">
          <Button
            variant="notion"
            size="sm"
            className="w-full justify-start"
            onClick={onBookCall}
            data-cursor-hint="Schedule a meeting"
          >
            📅 Book a call
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2"
            onClick={toggleTheme}
            data-cursor-hint="Toggle light / dark mode"
          >
            {theme === "light" ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
            {theme === "light" ? "Dark mode" : "Light mode"}
          </Button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-background/95 px-4 py-3 backdrop-blur md:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <div className="border-b border-border px-4 py-4">
              <p className="text-xs font-medium text-muted-foreground">
                Workspace
              </p>
              <p className="mt-0.5 font-semibold">
                {portfolio.site.workspaceName}
              </p>
            </div>
            <div className="py-2">{nav}</div>
          </SheetContent>
        </Sheet>
        <span className="text-sm font-semibold">
          {portfolio.profile.pageIcon} Sahil
        </span>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "light" ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </Button>
          <Button variant="notion" size="sm" onClick={onBookCall}>
            Book
          </Button>
        </div>
      </header>
    </>
  );
}

export function useActiveSection() {
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const ids = portfolio.sections.map((s) => s.id);
    const observers: IntersectionObserver[] = [];

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: "-20% 0px -60% 0px", threshold: 0 },
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return activeSection;
}
