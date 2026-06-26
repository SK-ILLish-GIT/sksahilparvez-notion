import { createElement, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { GripVertical } from "lucide-react";

interface NotionBlockProps {
  children: ReactNode;
  className?: string;
  showHandle?: boolean;
}

export function NotionBlock({
  children,
  className,
  showHandle = true,
}: NotionBlockProps) {
  return (
    <div
      className={cn(
        "group relative rounded-sm px-1 py-1 transition-colors hover:bg-notion-hover",
        className,
      )}
    >
      {showHandle && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-40">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
      )}
      <div className={cn(showHandle && "pl-6")}>{children}</div>
    </div>
  );
}

export function NotionHeading({
  children,
  level = 2,
  className,
}: {
  children: ReactNode;
  level?: 1 | 2 | 3;
  className?: string;
}) {
  const sizes = {
    1: "text-4xl font-bold tracking-tight",
    2: "text-2xl font-semibold",
    3: "text-lg font-semibold",
  };

  return createElement(
    `h${level}`,
    {
      className: cn(
        sizes[level],
        "text-emerald-600 dark:text-emerald-400",
        className,
      ),
    },
    children,
  );
}

export function NotionSubheading({
  children,
  className,
  as: Tag = "h3",
}: {
  children: ReactNode;
  className?: string;
  as?: "h3" | "p";
}) {
  return createElement(
    Tag,
    {
      className: cn(
        "mb-2 text-sm font-semibold uppercase tracking-wide text-pink-500 dark:text-pink-400",
        className,
      ),
    },
    children,
  );
}

export function NotionDivider() {
  return <div className="my-6 h-px w-full bg-border" />;
}
