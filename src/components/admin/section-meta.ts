export interface SectionMeta {
  label: string;
  icon: string;
  description: string;
  group: "Identity" | "Career" | "Content" | "Settings";
}

export const SECTION_META: Record<string, SectionMeta> = {
  profile: {
    label: "Profile",
    icon: "👤",
    description: "Hero name, tagline, summary, and property pills",
    group: "Identity",
  },
  site: {
    label: "Site",
    icon: "⚙️",
    description: "Social links, CV, cover image, Cal.com meetings",
    group: "Settings",
  },
  sections: {
    label: "Navigation",
    icon: "🧭",
    description: "Sidebar sections and visibility toggles",
    group: "Settings",
  },
  heroStats: {
    label: "Hero stats",
    icon: "📊",
    description: "Stat pills under the hero tagline",
    group: "Identity",
  },
  experience: {
    label: "Experience",
    icon: "💼",
    description: "Work history entries",
    group: "Career",
  },
  education: {
    label: "Education",
    icon: "🎓",
    description: "Degrees and academic timeline",
    group: "Career",
  },
  projects: {
    label: "Projects",
    icon: "🚀",
    description: "Portfolio projects and bento layout",
    group: "Career",
  },
  skills: {
    label: "Skills",
    icon: "🧠",
    description: "Skill groups and technology logos",
    group: "Content",
  },
  certifications: {
    label: "Certifications",
    icon: "📜",
    description: "Kanban certification cards",
    group: "Content",
  },
  achievements: {
    label: "Coding platforms",
    icon: "🏆",
    description: "Competitive programming profiles and ranks",
    group: "Content",
  },
  volunteer: {
    label: "Volunteer",
    icon: "🤝",
    description: "Volunteer todo items and detail sheets",
    group: "Content",
  },
  recommendations: {
    label: "Recommendations",
    icon: "💬",
    description: "Testimonials carousel",
    group: "Content",
  },
  contact: {
    label: "Contact",
    icon: "📬",
    description: "Contact method links",
    group: "Settings",
  },
};

export const SECTION_GROUPS = [
  "Identity",
  "Career",
  "Content",
  "Settings",
] as const;
