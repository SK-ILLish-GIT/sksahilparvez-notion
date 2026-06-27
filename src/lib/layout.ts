/**
 * Standard layout breakpoints (Tailwind defaults):
 *
 * | Tier   | Width        | Shell / layout |
 * |--------|--------------|----------------|
 * | mobile | < 640px      | Drawer nav, px-4, section gap 24px |
 * | sm     | 640–767px    | Hero upgrade, section gap 32px |
 * | md     | 768–1023px   | Sidebar, px-12, section gap 40px |
 * | lg     | 1024px+      | 3-col bento, section gap 48px |
 */

/** Main content horizontal padding */
export const PAGE_X = "px-4 md:px-12";

/** Main content bottom padding */
export const PAGE_PB = "pb-6 md:pb-10";

/** Vertical stack: gap between sections (tighter on small screens) */
export const SECTION_STACK =
  "flex flex-col gap-6 pt-6 sm:gap-8 sm:pt-8 md:gap-10 md:pt-10 lg:gap-12 lg:pt-12";

/** Anchor scroll offset for in-page section links */
export const SECTION_SCROLL_MT = "scroll-mt-8 md:scroll-mt-10";

/** Hero cover height */
export const HERO_COVER = "relative h-44 w-full sm:h-52 md:h-60";

/** Hero avatar overlap */
export const HERO_AVATAR_OFFSET = "relative -mt-12 sm:-mt-14";

/** Hero name */
export const HERO_TITLE = "text-3xl font-bold tracking-tight sm:text-5xl";

/** Property pills: 2×2 mobile → 1×4 at md */
export const PROPERTY_PILL_GRID =
  "grid grid-cols-2 gap-x-4 gap-y-3 md:grid-cols-4 md:gap-4";

/** Projects bento: 1 → 2 (sm) → 2 (md) → 3 (lg) */
export const PROJECTS_BENTO_GRID =
  "grid auto-rows-min grid-flow-dense grid-cols-1 gap-3 sm:auto-rows-[11rem] sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 lg:auto-rows-[12rem]";

export const PROJECT_BENTO_SPAN = {
  large: "sm:col-span-2 sm:row-span-2",
  wide: "sm:col-span-2",
  tall: "sm:row-span-2",
  small: "",
} as const;

export const BENTO_WIDGET_SPAN = {
  wide: "sm:col-span-2",
  tall: "sm:row-span-2",
  small: "",
} as const;

/** Contact cards */
export const CONTACT_GRID = "grid gap-2 sm:grid-cols-2";

/** Certifications: carousel below sm, grid at sm+ */
export const CERTS_CAROUSEL =
  "flex min-w-max snap-x snap-mandatory sm:min-w-0 sm:grid sm:snap-none sm:items-stretch";

export const CERTS_SCROLL = "-mx-px overflow-x-auto sm:overflow-visible";

export const CERT_CARD_MOBILE =
  "flex w-[min(260px,calc(100vw-2rem))] shrink-0 snap-start flex-col sm:w-auto sm:shrink";

/** CP problems chart: stacked → row at sm */
export const CP_CHART_ROW =
  "mx-auto flex h-full min-h-0 w-full flex-col items-stretch justify-start gap-0 overflow-y-auto sm:flex-row sm:items-center sm:justify-center";

/** Skills section inner padding */
export const SKILLS_INNER_X = "px-3 py-3 sm:px-4";
