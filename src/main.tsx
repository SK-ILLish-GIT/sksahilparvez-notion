import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@/components/theme-provider";
import { CursorGuideProvider } from "@/components/cursor/CursorGuide";
import {
  MobileNavBar,
  NotionSidebar,
  useActiveSection,
} from "@/components/notion/NotionSidebar";
import { SlashCommand } from "@/components/notion/SlashCommand";
import { NotionDivider } from "@/components/notion/NotionBlock";
import { CalInit } from "@/components/booking/CalInit";
import { PageHeader } from "@/components/sections/PageHeader";
import { AboutSection } from "@/components/sections/AboutSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { EducationSection } from "@/components/sections/EducationSection";
import { CertificationsSection } from "@/components/sections/CertificationsSection";
import { AchievementsSection } from "@/components/sections/AchievementsSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { PAGE_PB, PAGE_X } from "@/lib/layout";
import { cn } from "@/lib/utils";
import "@/index.css";

function App() {
  const activeSection = useActiveSection();

  return (
    <ThemeProvider>
      <CursorGuideProvider>
        <CalInit />
        <div className="min-h-screen md:pl-60">
          <NotionSidebar activeSection={activeSection} />

          <main className="min-h-screen w-full min-w-0">
            <MobileNavBar activeSection={activeSection} />
            <PageHeader />
            <div className={cn("mx-auto max-w-[900px]", PAGE_X, PAGE_PB)}>
              <NotionDivider />
              <AboutSection />
              <EducationSection />
              <ExperienceSection />
              <ProjectsSection />
              <SkillsSection />
              <CertificationsSection />
              <AchievementsSection />
              <ContactSection />
            </div>
          </main>
        </div>

        <SlashCommand />

        <div className="fixed bottom-4 right-4 hidden text-xs text-muted-foreground md:block">
          Press{" "}
          <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono">
            ⌘K
          </kbd>{" "}
          to search
        </div>
      </CursorGuideProvider>
    </ThemeProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
