import type { EducationItem } from "@/types/portfolio";

export const TIMELINE_WINDOW_YEARS = 8;
export const TIMELINE_FORWARD_YEARS = 2;
export const TIMELINE_START = "1999-01-01";
export const BIRTHDATE = "2000-07-12";

export interface TimelineMilestone {
  date: string;
  /** Shown in captions, e.g. "Feb 2010" */
  displayDate: string;
  label: string;
  icon: string;
  lineClass: string;
  badgeClass: string;
}

export const BIRTHDAY_DISPLAY_DATE = "Jul 12, 2000";
export const BIRTHDAY_CAPTION = `🎂 ${BIRTHDAY_DISPLAY_DATE} — My Birthday`;

export const TIMELINE_MILESTONES: TimelineMilestone[] = [
  {
    date: "2010-02-01",
    displayDate: "Feb 2010",
    label: "I met Her",
    icon: "💕",
    lineClass: "bg-rose-400",
    badgeClass: "bg-rose-400",
  },
];

export interface TimelineLayout {
  left: number;
  width: number;
  row: number;
}

export interface YearMarker {
  label: string;
  left: number;
}

export interface TimelineBounds {
  min: number;
  max: number;
  span: number;
}

/** Fractional year e.g. 2021-07 → 2021.5 */
export function parseYearFraction(value: string): number {
  const [year, month, day] = value.split("-").map(Number);
  const dayFraction = day ? (day - 1) / 365 : 0;
  return year + (month - 1) / 12 + dayFraction / 12;
}

export function getCurrentYearFraction(): number {
  const now = new Date();
  return (
    now.getFullYear() + now.getMonth() / 12 + (now.getDate() - 1) / 365 / 12
  );
}

export const BIRTHDATE_FRACTION = parseYearFraction(BIRTHDATE);
export const TIMELINE_START_FRACTION = parseYearFraction(TIMELINE_START);

export function getAbsoluteLimits() {
  const today = getCurrentYearFraction();
  return {
    minStart: TIMELINE_START_FRACTION,
    maxStart: today + TIMELINE_FORWARD_YEARS - TIMELINE_WINDOW_YEARS,
    today,
  };
}

export function getFullTimelineBounds(): TimelineBounds {
  const today = getCurrentYearFraction();
  const min = TIMELINE_START_FRACTION;
  const max = today + TIMELINE_FORWARD_YEARS;
  return { min, max, span: max - min };
}

export function getDefaultViewStart(): number {
  const { today } = getAbsoluteLimits();
  return today - TIMELINE_WINDOW_YEARS;
}

/** Pixel offset to scroll so the default 8-year window around today is visible */
export function getDefaultScrollLeft(
  scrollContentWidth: number,
  clientWidth: number,
  bounds: TimelineBounds,
  padding: number,
): number {
  const viewStart = getDefaultViewStart();
  const contentWidth = scrollContentWidth - padding * 2;
  const offset =
    padding + ((viewStart - bounds.min) / bounds.span) * contentWidth;
  const maxScroll = Math.max(0, scrollContentWidth - clientWidth);
  return Math.min(maxScroll, Math.max(0, offset - clientWidth / 4));
}

/** One row per item, stacked vertically; horizontal position follows dates. */
export function layoutEducationTimelinePx(
  items: EducationItem[],
  bounds: TimelineBounds,
  contentWidth: number,
  padding: number,
): Map<string, TimelineLayout & { leftPx: number; widthPx: number }> {
  const sorted = [...items].sort(
    (a, b) => parseYearFraction(a.startDate) - parseYearFraction(b.startDate),
  );

  const layouts = new Map<
    string,
    TimelineLayout & { leftPx: number; widthPx: number }
  >();

  sorted.forEach((item, row) => {
    const rawStart = parseYearFraction(item.startDate);
    const rawEnd = parseYearFraction(item.endDate);

    const start = Math.max(rawStart, bounds.min);
    const end = Math.min(rawEnd, bounds.max);

    if (end <= start) return;

    const leftPx = toContentPosition(start, bounds, contentWidth, padding);
    const rightPx = toContentPosition(end, bounds, contentWidth, padding);
    const widthPx = Math.max(rightPx - leftPx, 88);

    const left = ((start - bounds.min) / bounds.span) * 100;
    const width = Math.max(((end - start) / bounds.span) * 100, 10);

    layouts.set(item.id, { left, width, row, leftPx, widthPx });
  });

  return layouts;
}

export function getRowCount(layouts: Map<string, TimelineLayout>): number {
  let max = 0;
  layouts.forEach((l) => {
    max = Math.max(max, l.row + 1);
  });
  return max || 1;
}

export function getYearMarkersPx(
  bounds: TimelineBounds,
  contentWidth: number,
  padding: number,
): { label: string; leftPx: number }[] {
  const startYear = Math.floor(bounds.min);
  const endYear = Math.ceil(bounds.max);
  const markers: { label: string; leftPx: number }[] = [];

  for (let year = startYear; year <= endYear; year++) {
    markers.push({
      label: String(year),
      leftPx: toContentPosition(year, bounds, contentWidth, padding),
    });
  }

  return markers;
}

export function getMarkerPosition(
  date: number,
  bounds: TimelineBounds,
  contentWidth: number,
  padding: number,
): number | null {
  if (date < bounds.min || date > bounds.max) return null;
  return padding + ((date - bounds.min) / bounds.span) * contentWidth;
}

export function toContentPosition(
  yearFraction: number,
  bounds: TimelineBounds,
  contentWidth: number,
  padding: number,
): number {
  return padding + ((yearFraction - bounds.min) / bounds.span) * contentWidth;
}

export function formatViewRange(bounds: TimelineBounds): string {
  const fmt = (v: number) => String(Math.floor(v));
  return `${fmt(bounds.min)} – ${fmt(bounds.max)}`;
}

export function milestoneCaption(milestone: TimelineMilestone): string {
  return `${milestone.icon} ${milestone.label}`;
}
