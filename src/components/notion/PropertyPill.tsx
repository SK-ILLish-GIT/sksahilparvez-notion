import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PropertyPillProps {
  label: string;
  value: string;
  type?: string;
  className?: string;
}

export function PropertyPill({
  label,
  value,
  type,
  className,
}: PropertyPillProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      {type === "status" ? (
        <Badge variant="status" className="w-fit gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          {value}
        </Badge>
      ) : (
        <Badge variant="property" className="w-fit">
          {value}
        </Badge>
      )}
    </div>
  );
}
