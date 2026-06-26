import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@/components/theme-provider";
import { CursorGuideProvider } from "@/components/cursor/CursorGuide";
import {
  NotionSidebar,
  useActiveSection,
} from "@/components/notion/NotionSidebar";
import { SlashCommand } from "@/components/notion/SlashCommand";
import { NotionDivider } from "@/components/notion/NotionBlock";
import { PageHeader } from "@/components/sections/PageHeader";
import { AboutSection } from "@/components/sections/AboutSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { EducationSection } from "@/components/sections/EducationSection";
import { CertificationsSection } from "@/components/sections/CertificationsSection";
import { AchievementsSection } from "@/components/sections/AchievementsSection";
import { ContactSection } from "@/components/sections/ContactSection";
import "@/index.css";

function App() {
  const activeSection = useActiveSection();
  const [bookOpen, setBookOpen] = useState(false);

  const handleBookCall = () => {
    if (window.innerWidth < 768) {
      setBookOpen(true);
    } else {
      document
        .getElementById("contact")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <ThemeProvider>
      <CursorGuideProvider>
        <div className="flex min-h-screen">
          <NotionSidebar
            activeSection={activeSection}
            onBookCall={handleBookCall}
          />

          <main className="min-h-screen flex-1 overflow-x-hidden md:ml-60">
            <PageHeader onBookCall={handleBookCall} />
            <div className="mx-auto max-w-[900px] px-6 pb-6 sm:px-12 sm:pb-10">
              <NotionDivider />
              <AboutSection />
              <EducationSection />
              <ExperienceSection />
              <ProjectsSection />
              <SkillsSection />
              <CertificationsSection />
              <AchievementsSection />
              <ContactSection
                bookOpen={bookOpen}
                onBookOpenChange={setBookOpen}
              />
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
