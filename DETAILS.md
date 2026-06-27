# Notion Portfolio — Project Details

A single-page developer portfolio that mimics Notion’s workspace UX: sidebar navigation, block-style sections, property tables, and slide-over detail sheets. All static content is authored as typed JSON; two live integrations enrich the experience at runtime.

## Overview

The app is a client-only React SPA — no backend server. Vite bundles the site; content ships with the build. Users browse sections via the sidebar or `⌘K` slash command, open project detail sheets, and view live stats where APIs allow.

| Area               | What it does                                                                                |
| ------------------ | ------------------------------------------------------------------------------------------- |
| **Layout**         | Fixed Notion-style sidebar (md+), mobile drawer, cover banner header, main column max 900px |
| **Projects**       | Responsive bento grid, portfolio widgets, GitHub-powered detail sheets                      |
| **Experience**     | Timeline + table views (stacked in one grid cell to prevent layout shift)                   |
| **Education**      | Gantt chart + table                                                                         |
| **Certifications** | Kanban board (To do / In progress / Done); skeleton cards in empty columns                  |
| **Coding**         | Live Codolio stats, problems donut, topic breakdown charts (fixed view height)              |
| **Contact**        | Bookmark links + Cal.com embed                                                              |

---

## Architecture

```mermaid
flowchart TB
  subgraph Browser["Browser (SPA)"]
    direction TB
    subgraph Shell["App shell"]
      Sidebar["NotionSidebar<br/>profile · nav · social · ⌘K hint"]
      Mobile["MobileNavBar<br/>drawer · avatar · theme"]
      Header["PageHeader<br/>cover · avatar · actions"]
      Slash["SlashCommand (⌘K)"]
    end
    subgraph Main["Main content"]
      Sections["Sections<br/>About → Contact"]
      Projects["ProjectsSection<br/>bento grid + widgets"]
      Sheet["Detail Sheet"]
      Highlights["JSON highlights"]
      GitHubMeta["GitHub metadata"]
      DetailsMd["DETAILS.md"]
    end
    Sidebar --- Header
    Mobile --- Header
    Header --- Sections
    Sections --> Projects
    Projects --> Sheet
    Sheet --> Highlights
    Sheet --> GitHubMeta
    Sheet --> DetailsMd
  end

  JSON["src/data/content/*.json<br/>(build-time bundle)"]
  GitHubAPI["GitHub REST API"]
  CodolioAPI["Codolio profile API"]

  JSON --> Sections
  Projects --> GitHubAPI
  Sections --> CodolioAPI
  GitHubAPI --> GitHubMeta
  GitHubAPI --> DetailsMd
```

### Data flow

1. **Static content** — JSON files under `src/data/content/` are imported in `src/data/index.ts`, typed via `src/types/portfolio.ts`, and passed to section components.
2. **GitHub project sheets** — When a project card opens, `useGithubProject` calls `fetchGithubProjectData()` in parallel for:
   - `DETAILS.md` (raw markdown from repo root)
   - Repo metadata (stars, forks, topics, license, dates, size)
   - Language breakdown, latest release, top contributors
3. **Codolio CP stats** — `useCodolioStats` fetches the Codolio profile API at runtime; on failure it falls back to `codolio-snapshot.json` (refreshed via `npm run sync:codolio`).

Results are cached in-memory for the session to avoid duplicate API calls.

---

## Layout system

Shared constants live in `src/lib/layout.ts` so breakpoints stay consistent across sections.

| Constant              | Purpose                                     |
| --------------------- | ------------------------------------------- |
| `PAGE_X`              | Main horizontal padding (`px-4 md:px-12`)   |
| `SECTION_STACK`       | Vertical gap between sections (24px → 48px) |
| `SECTION_SCROLL_MT`   | Anchor offset for in-page nav               |
| `SURFACE_ELEVATED`    | Light-mode card shadow (disabled in dark)   |
| `PROJECTS_BENTO_GRID` | Bento columns: 1 → 2 → 2 → 3                |
| `PROPERTY_PILL_GRID`  | Hero pills: 2×2 mobile → 1×4 at md          |

### Responsive tiers

| Tier   | Width    | Shell behavior                                   |
| ------ | -------- | ------------------------------------------------ |
| Mobile | `<640px` | Drawer nav, 1-col bento, no bento filler tiles   |
| `sm`   | 640px+   | 2-col grids, bento filler tiles, carousel → grid |
| `md`   | 768px+   | Fixed sidebar (`w-60`), wider page padding       |
| `lg`   | 1024px+  | 3-col projects bento                             |

### Sidebar

- **Header** — avatar (`profile.avatar`), name, title, status pill, workspace chip; click scrolls to hero
- **Nav** — scroll-spy active state (last section whose top passed ~32% viewport)
- **Footer** — `⌘K` search hint, social icons, 15 min call, segmented light/dark toggle

---

## Theme

CSS variables in `src/index.css`. Dark mode is unchanged; light mode uses a warm beige canvas with elevated white cards.

| Token                       | Light (approx.) | Role                      |
| --------------------------- | --------------- | ------------------------- |
| `--background`              | `#f6f1e6`       | Page canvas (warm beige)  |
| `--card`                    | `#ffffff`       | Cards, tables, sheets     |
| `--border`                  | `#cfc6b4`       | Borders & dividers        |
| `--notion-sidebar`          | `#f1ebe0`       | Sidebar surface           |
| `--surface-elevated-shadow` | soft shadow     | Light-mode card lift only |

The `.surface-elevated` utility applies the shadow in light mode; dark mode sets `--surface-elevated-shadow: none`.

Hero avatar, favicon, and OG meta image use `public/sk_sahil.jpeg`.

---

## Projects section

### Bento grid

The layout is defined in `BENTO_LAYOUT` inside `ProjectsSection.tsx` — an ordered list of project IDs, inline widgets (`stats`, `building`), and optional **filler tiles** (skeleton placeholders for grid gaps on `sm+`).

| Tile size         | Grid span      | Card behavior                                |
| ----------------- | -------------- | -------------------------------------------- |
| **1×1** (`small`) | 1 col × 1 row  | 1 highlight bullet, stack clamped to 2 lines |
| **2×1** (`wide`)  | 2 cols × 1 row | 2 highlight bullets, 2-line clamp            |
| **1×2** (`tall`)  | 1 col × 2 rows | 2 highlight bullets, full text (no clamp)    |

Each card shows: icon, name, tagline, featured star, GitHub/demo links (top-right), up to 5 stack tags (sorted by global frequency across all projects).

### Detail sheet (on card click)

Rendered inside a Radix `Sheet` slide-over:

1. **Header** — project name + tagline
2. **Property table** — period, status, GitHub stats (stars, forks, size, visibility, created/updated, contributors, topics, license, latest release)
3. **Stack & languages** — JSON stack tags + GitHub language bar chart
4. **Highlights** — bullet list from `projects.json`
5. **Details** — this file (`DETAILS.md`), rendered with `react-markdown` + `remark-gfm`; falls back to optional `architecture` field in JSON if the file is missing

---

## Experience section

Timeline and table views render in the **same grid cell** (one visible, one `invisible` but still measured) so toggling views does not shift content below. The table uses a custom column grid (`Company · Role · Stack`) with compact row padding.

---

## Certifications section

Kanban columns appear when they have cards, except **To do** which always shows. Empty columns render a **non-clickable skeleton card** instead of placeholder text.

On mobile, columns scroll horizontally as snap cards; at `sm+` they become a multi-column board grid.

---

## Coding section

Formerly labeled “Competitive Programming” in the UI; sidebar anchor id remains `achievements`.

Three views share a **fixed height container** (320px) so switching Table / Problems / Topics does not move downstream sections:

- **Table** — platform ratings, handles, best ranks
- **Problems** — Recharts donut + platform breakdown bars
- **Topics** — stacked bar chart + optional heatmap sheet

---

## Live integrations

### GitHub API

| Endpoint                                        | Purpose                    |
| ----------------------------------------------- | -------------------------- |
| `GET /repos/{owner}/{repo}/contents/DETAILS.md` | Project deep-dive markdown |
| `GET /repos/{owner}/{repo}`                     | Core repo metadata         |
| `GET /repos/{owner}/{repo}/languages`           | Language byte breakdown    |
| `GET /repos/{owner}/{repo}/releases/latest`     | Latest release tag         |
| `GET /repos/{owner}/{repo}/contributors`        | Top contributors           |

Optional `VITE_GITHUB_TOKEN` in `.env` raises the rate limit from 60 → 5,000 requests/hour.

### Codolio API

Fetches coding stats for LeetCode, GeeksforGeeks, and InterviewBit handles defined in `achievements.json`. Normalizes:

- Current / max rating and rank
- Total problems solved per platform
- Topic-wise distribution (Codeforces topics from `dailyActivityStatsResponse`)

Static fallbacks exist for platforms without live API support (foolcoder, pir0_coder).

---

## Content model

All editable portfolio data lives in `src/data/content/`:

| File                    | Contents                                                                         |
| ----------------------- | -------------------------------------------------------------------------------- |
| `profile.json`          | Name, title, summary, `avatar` path, property pills                              |
| `site.json`             | Workspace name, social links, Cal.com URL, CV link, cover image                  |
| `sections.json`         | Sidebar order, labels, icons, visibility flags                                   |
| `experience.json`       | Work history entries                                                             |
| `education.json`        | Degrees with timeline dates                                                      |
| `projects.json`         | Projects: stack, links, bento size, highlights, optional `architecture` fallback |
| `skills.json`           | Grouped skill lists                                                              |
| `certifications.json`   | Kanban certification cards                                                       |
| `achievements.json`     | CP platform handles, static ranks, chart config                                  |
| `contact.json`          | Contact method links                                                             |
| `hero-stats.json`       | Stat pills under the page header                                                 |
| `codolio-snapshot.json` | Build-time CP snapshot (generated)                                               |

Types are centralized in `src/types/portfolio.ts`.

---

## Source layout

```
src/
├── components/
│   ├── notion/           # Sidebar, blocks, property table, slash command
│   ├── sections/         # Page sections (Projects, Experience, Coding, …)
│   ├── projects/         # GitHub detail body, markdown renderer, language bars
│   ├── contact/          # Hero contact dropdown
│   ├── ui/               # shadcn primitives (sheet, badge, button, …)
│   ├── booking/          # Cal.com embed
│   ├── cursor/           # Custom cursor hint provider
│   └── theme-provider.tsx
├── data/
│   ├── content/          # Portfolio JSON (source of truth)
│   └── index.ts          # Barrel export + derived stats
├── hooks/
│   ├── useGithubProject.ts
│   └── useCodolioStats.ts
├── lib/
│   ├── layout.ts         # Breakpoints, spacing, grid class constants
│   ├── github.ts         # GitHub API client + caching
│   ├── codolio.ts        # Codolio fetch + normalization
│   └── education-timeline.ts
└── types/
    └── portfolio.ts      # Shared TypeScript interfaces
```

## Design decisions

- **JSON over CMS** — zero hosting cost, full type safety, version-controlled content, no API keys for content edits.
- **`DETAILS.md` over README** — README stays repo-focused; `DETAILS.md` carries portfolio-specific deep dives without polluting GitHub’s default view.
- **Client-side API calls** — keeps deployment simple (static hosting on Vercel/Netlify/GitHub Pages); trade-off is exposed token in env var (mitigated by read-only PAT scoped to public repos).
- **Codolio snapshot fallback** — Coding section stays populated even when the live API is down or rate-limited.
- **Bento-only projects view** — table view removed; bento grid is the primary visual showcase.
- **View-stable layouts** — Experience and Coding sections avoid layout shift when toggling views (grid overlay / fixed height).
- **Light-mode elevation** — beige canvas + white cards + subtle shadow so surfaces remain readable without changing dark theme.

---

## Current project roster

| Project               | Tile     | Featured |
| --------------------- | -------- | -------- |
| coldMail              | 2×1 wide | ✓        |
| Notion Portfolio      | 2×1 wide | ✓        |
| GameVault             | 1×2 tall | ✓        |
| PriceTrackEr          | 2×1 wide | ✓        |
| Sports Centre Booking | 2×1 wide |          |
| File Organizer        | 1×2 tall |          |
| Image → LaTeX         | 2×1 wide |          |

Plus inline widgets: **Portfolio stats** (project count, featured count) and **Currently building** (in-progress projects with demo links).
