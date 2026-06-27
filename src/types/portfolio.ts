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
  avatar?: string;
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
  description: string;
  metric?: { label: string; value: string };
  logo?: string;
  credential?: { label: string; href: string };
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
  bentoSize: "large" | "wide" | "tall" | "small";
  coverGradient: string;
  highlights: string[];
  metric?: { label: string; value: string };
  architecture?: string;
}

export interface SkillItem {
  name: string;
  logo: string;
}

export interface SkillGroup {
  id: string;
  label: string;
  icon: string;
  coverGradient: string;
  items: SkillItem[];
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

export interface CpProfileLink {
  handle: string;
  href: string;
}

export interface Achievement {
  platform: string;
  codolioPlatform: string;
  /** Profile used for table rating + redirect link */
  ratingProfile: CpProfileLink;
  /** Profile used for problem/topic counts in charts */
  countProfile: CpProfileLink;
  /** Static rating when ratingProfile !== countProfile, or fallback */
  rating: string;
  /** Static contest global ranks (best first when sorted ascending) */
  bestRanks: number[];
  logo?: string;
  /** Fallback problem count when Codolio API is unavailable */
  fallbackProblems?: number;
}

export interface CpTableRow {
  platform: string;
  displayHandle: string;
  displayHref: string;
  rating: string;
  bestRanks: number[];
  logo?: string;
  isLive: boolean;
}

export interface CpProblemSlice {
  platform: string;
  count: number;
  logo?: string;
  fill: string;
}

export interface CpTopicEntry {
  topic: string;
  count: number;
}

export interface CpTopicPlatformSection {
  platform: string;
  codolioPlatform: string;
  logo?: string;
  rawTopics: CpTopicEntry[];
}

export interface CpSectionData {
  tableRows: CpTableRow[];
  problemBreakdown: CpProblemSlice[];
  topicBreakdownByPlatform: CpTopicPlatformSection[];
  totalProblems: number;
}

export interface ContactLink {
  label: string;
  value: string;
  href: string;
  logo: string;
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

export interface CalMeetingLink {
  id: string;
  label: string;
  link: string;
  hint?: string;
}

export interface SiteConfig {
  calLinks: CalMeetingLink[];
  cvPath: string;
  coverImage: string;
  github: string;
  linkedin: string;
  twitter: string;
  whatsapp: string;
  portfolio3d: string;
  workspaceName: string;
  lastUpdated: string;
  coverGradient: string;
}

export type SectionId = Section["id"];
