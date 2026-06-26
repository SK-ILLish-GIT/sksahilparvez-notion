import profile from "./content/profile.json";
import experience from "./content/experience.json";
import projects from "./content/projects.json";
import skills from "./content/skills.json";
import education from "./content/education.json";
import certifications from "./content/certifications.json";
import achievements from "./content/achievements.json";
import contact from "./content/contact.json";
import heroStats from "./content/hero-stats.json";
import sections from "./content/sections.json";
import site from "./content/site.json";

import type {
  Achievement,
  Certification,
  ContactLink,
  EducationItem,
  ExperienceItem,
  HeroStat,
  Profile,
  ProjectItem,
  Section,
  SiteConfig,
  SkillGroup,
} from "@/types/portfolio";

export const portfolio = {
  profile: profile as Profile,
  experience: experience as ExperienceItem[],
  projects: projects as ProjectItem[],
  skills: skills as SkillGroup[],
  education: education as EducationItem[],
  certifications: certifications as Certification[],
  achievements: achievements as Achievement[],
  contact: contact as ContactLink[],
  heroStats: heroStats as HeroStat[],
  sections: (sections as Section[]).filter((s) => s.visible),
  site: site as SiteConfig,
};

export const derivedStats = {
  experienceCount: portfolio.experience.length,
  projectCount: portfolio.projects.length,
  totalSkills: portfolio.skills.flatMap((g) => g.items).length,
};
