# Notion Portfolio

A Notion-inspired developer portfolio — single-page SPA with sidebar navigation, database-style sections, and detail sheets. Content lives in JSON; competitive programming stats can load live from Codolio; project sheets pull **`details.md`** and repo metadata from each GitHub repo.

**Live:** add your deployment URL here  
**Author:** [SK Sahil Parvez](https://github.com/SK-ILLish-GIT)

---

## Features

### Layout & UX

- Notion-style sidebar, page header with cover banner, and block-based sections
- Light / dark theme
- Custom cursor hints and `⌘K` slash command for quick section jump
- Cal.com embed for booking calls

### Multi-view sections

| Section                     | Views                                                                                               |
| --------------------------- | --------------------------------------------------------------------------------------------------- |
| **Projects**                | Bento grid + table; detail sheet with GitHub `details.md`, repo stats, stack, languages, highlights |
| **Experience**              | Timeline + table                                                                                    |
| **Education**               | Gantt + table                                                                                       |
| **Certifications**          | Kanban (To do / In progress / Done)                                                                 |
| **Competitive Programming** | Table, problems donut, topics breakdown                                                             |

### Live integrations

- **Codolio** — live CP ratings, problem counts, and topic stats (with build-time snapshot + static JSON fallback)
- **GitHub API** — `details.md` per repo, language breakdown, contributors, releases, stars/forks, topics (optional token for higher rate limits)

### Projects bento

- Mixed tile sizes: `1×1`, `2×1` (wide), `1×2` (tall)
- Highlight bullets on cards, stack tags, direct GitHub / demo links
- Portfolio stats and “Currently building” widgets

---

## Tech stack

- **React 19** + **TypeScript** + **Vite 7**
- **Tailwind CSS 4** + **shadcn/ui** (Radix)
- **Recharts** — CP charts
- **Framer Motion** — section animations
- **react-markdown** + **remark-gfm** — render `details.md` from GitHub
- **Husky** + **lint-staged** — pre-commit hooks

---

## Getting started

### Prerequisites

- Node.js 20+
- npm

### Install & run

```bash
git clone https://github.com/SK-ILLish-GIT/sksahilparvez-notion.git
cd sksahilparvez-notion
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Build

```bash
npm run build
npm run preview
```

### Lint & format

```bash
npm run lint
npm run lint:fix
npm run format
npm run format:check
```

---

## Environment variables

Copy the example file and add an optional GitHub token:

```bash
cp .env.example .env
```

| Variable            | Required | Description                                                                                                                          |
| ------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `VITE_GITHUB_TOKEN` | No       | GitHub PAT for project sheets (`details.md`, languages, contributors, releases). Without it: 60 req/hr limit; with it: 5,000 req/hr. |

Create a token at [github.com/settings/tokens](https://github.com/settings/tokens) with `public_repo` (classic) or read-only repo access (fine-grained).

Restart the dev server after changing `.env`.

---

## Editing content

All portfolio content is JSON under `src/data/content/`:

| File                  | Contents                                  |
| --------------------- | ----------------------------------------- |
| `profile.json`        | Name, title, summary, properties          |
| `site.json`           | Social links, Cal.com, CV, workspace name |
| `sections.json`       | Sidebar section order & icons             |
| `experience.json`     | Work history                              |
| `education.json`      | Degrees & timeline                        |
| `projects.json`       | Projects, bento sizes, highlights, links  |
| `skills.json`         | Skill groups                              |
| `certifications.json` | Kanban certifications                     |
| `achievements.json`   | CP platforms, handles, ranks              |
| `contact.json`        | Contact methods                           |
| `hero-stats.json`     | Hero stat pills                           |

Types are defined in `src/types/portfolio.ts`. The barrel export is `src/data/index.ts`.

---

## Project details docs

Each linked GitHub repo can include an **`details.md`** at the repo root. The portfolio fetches and renders it in the project detail sheet (after Highlights).

Until you add the file, repos fall back to the optional `architecture` field in `projects.json` (e.g. GameVault’s ASCII diagram).

Example repo layout:

```
my-project/
├── details.md   ← loaded by the portfolio
├── README.md         ← not shown in the portfolio sheet
└── ...
```

---

Refresh the CP snapshot used when live Codolio fetch fails:

```bash
npm run sync:codolio
```

Writes to `src/data/content/codolio-snapshot.json`.

---

## Project structure

```
src/
├── components/
│   ├── notion/          # Blocks, sidebar, property table
│   ├── sections/        # Page sections (Projects, Experience, …)
│   ├── projects/        # GitHub details.md, languages, detail body
│   └── ui/              # shadcn components
├── data/content/        # Portfolio JSON
├── hooks/               # useCodolioStats, useGithubProject
├── lib/                 # codolio, github, utils
└── types/               # TypeScript interfaces
```

---

## Scripts

| Script                 | Description                  |
| ---------------------- | ---------------------------- |
| `npm run dev`          | Start Vite dev server        |
| `npm run build`        | Typecheck + production build |
| `npm run preview`      | Preview production build     |
| `npm run sync:codolio` | Sync Codolio snapshot JSON   |
| `npm run lint`         | ESLint                       |
| `npm run format`       | Prettier write               |

---

## License

Personal portfolio — © SK Sahil Parvez. Fork and adapt with attribution.
