/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** GitHub PAT for details.md + repo metadata (optional, improves rate limits) */
  readonly VITE_GITHUB_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
