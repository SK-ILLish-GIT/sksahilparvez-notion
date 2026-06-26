export interface ProfileProperty {
  label: string;
  value: string;
  type?: string;
  color?: string;
}

export interface Profile {
  name: string;
  title: string;
  pageIcon: string;
  tagline: string;
  summary: string;
  taglineRotation: string[];
  properties: ProfileProperty[];
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  stack: string[];
  highlights: string[];
  metric?: { label: string; value: string };
}

export interface ProjectItem {
  id: string;
  name: string;
  tagline: string;
  period: string;
  pageIcon: string;
  stack: string[];
  links: { github?: string; demo?: string | null };
  featured: boolean;
  bentoSize: "large" | "small";
  coverGradient: string;
  highlights: string[];
}

export interface SkillGroup {
  id: string;
  label: string;
  items: string[];
}

export type EducationStatus = "completed" | "in-progress";

export interface EducationItem {
  id: string;
  institution: string;
  shortTitle: string;
  degree: string;
  startDate: string;
  endDate: string;
  period?: string;
  marks: string;
  marksLabel?: string;
  location?: string;
  rank?: string;
  status: EducationStatus;
  statusLabel: string;
  pageIcon: string;
  description: string;
  highlights: string[];
}

export type CertificationStatus = "todo" | "in-progress" | "done";

export interface Certification {
  id: string;
  text: string;
  title: string;
  issuer: string;
  period?: string;
  status: CertificationStatus;
  pageIcon: string;
  description: string;
  highlights: string[];
  link?: string;
}

export interface Achievement {
  platform: string;
  rating: string;
  bestRank: string;
  handle: string;
  highlight?: boolean;
}

export interface ContactLink {
  label: string;
  value: string;
  href: string;
}

export interface HeroStat {
  id: string;
  label: string;
  value: number;
  suffix: string;
}

export interface Section {
  id: string;
  label: string;
  icon: string;
  visible: boolean;
}

export interface SiteConfig {
  calLink: string;
  cvPath: string;
  coverImage: string;
  github: string;
  linkedin: string;
  twitter: string;
  portfolio3d: string;
  workspaceName: string;
  lastUpdated: string;
  coverGradient: string;
}

export type SectionId = Section["id"];
