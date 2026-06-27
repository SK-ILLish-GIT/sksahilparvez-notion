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
import { VolunteerSection } from "@/components/sections/VolunteerSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { PageFooter } from "@/components/sections/PageFooter";
import { PAGE_PB, PAGE_X, SECTION_STACK } from "@/lib/layout";
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
            <div
              className={cn(
                "mx-auto max-w-[900px]",
                SECTION_STACK,
                PAGE_X,
                PAGE_PB,
              )}
            >
              <NotionDivider />
              <AboutSection />
              <EducationSection />
              <ExperienceSection />
              <ProjectsSection />
              <SkillsSection />
              <CertificationsSection />
              <AchievementsSection />
              <VolunteerSection />
              <ContactSection />
              <PageFooter />
            </div>
          </main>
        </div>

        <SlashCommand />
      </CursorGuideProvider>
    </ThemeProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
