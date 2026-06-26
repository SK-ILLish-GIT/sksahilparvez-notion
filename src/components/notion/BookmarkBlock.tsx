import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookmarkBlockProps {
  href: string;
  label: string;
  value: string;
  className?: string;
}

export function BookmarkBlock({
  href,
  label,
  value,
  className,
}: BookmarkBlockProps) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      data-cursor-hint={`Open ${label}`}
      className={cn(
        "group flex items-center gap-3 rounded-md border border-border bg-card p-3 transition-colors hover:bg-notion-hover",
        className,
      )}
    >
      <span className="text-lg">🔗</span>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-medium text-primary group-hover:underline">
          {value}
        </p>
      </div>
      <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
    </a>
  );
}
