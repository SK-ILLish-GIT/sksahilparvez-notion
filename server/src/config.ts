import dotenv from "dotenv";

dotenv.config();

function required(name: string, value: string | undefined): string {
  if (!value?.trim()) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value.trim();
}

export const config = {
  port: Number(process.env.PORT ?? 3001),
  mongoUri: required("MONGODB_URI", process.env.MONGODB_URI),
  corsOrigins: (process.env.CORS_ORIGINS ?? "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  adminApiKey: process.env.ADMIN_API_KEY?.trim() ?? "",
  adminPassword: process.env.ADMIN_PASSWORD?.trim() ?? "",
  get sessionSecret(): string {
    return this.adminApiKey || this.adminPassword;
  },
  liveVisitorWindowMs: 2 * 60 * 1000,
};

export const CONTENT_KEYS = [
  "profile",
  "experience",
  "projects",
  "skills",
  "education",
  "certifications",
  "achievements",
  "volunteer",
  "recommendations",
  "contact",
  "heroStats",
  "sections",
  "site",
] as const;

export type ContentKey = (typeof CONTENT_KEYS)[number];

/** MongoDB key → JSON filename (when they differ) */
export const CONTENT_FILE_NAMES: Partial<Record<ContentKey, string>> = {
  heroStats: "hero-stats",
};

export function contentFileName(key: ContentKey): string {
  return CONTENT_FILE_NAMES[key] ?? key;
}
