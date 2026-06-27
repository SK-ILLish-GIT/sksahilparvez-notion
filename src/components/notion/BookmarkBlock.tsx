import { ExternalLink } from "lucide-react";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { cn } from "@/lib/utils";

interface BookmarkBlockProps {
  href: string;
  label: string;
  value: string;
  logo: string;
  className?: string;
}

export function BookmarkBlock({
  href,
  label,
  value,
  logo,
  className,
}: BookmarkBlockProps) {
  const external = href.startsWith("http");

  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      data-cursor-hint={`Open ${label}`}
      className={cn(
        "group flex items-center gap-3 rounded-md border border-border bg-card p-3 transition-colors hover:bg-notion-hover surface-elevated",
        className,
      )}
    >
      <BrandLogo src={logo} alt={label} size="md" />
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-medium text-primary group-hover:underline">
          {value}
        </p>
      </div>
      {external && (
        <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      )}
    </a>
  );
}
