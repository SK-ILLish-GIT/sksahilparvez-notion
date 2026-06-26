import { cn } from "@/lib/utils";

interface CalloutBlockProps {
  icon: string;
  children: React.ReactNode;
  variant?: "blue" | "yellow";
  title?: string;
  className?: string;
}

export function CalloutBlock({
  icon,
  children,
  variant = "blue",
  title,
  className,
}: CalloutBlockProps) {
  return (
    <div
      className={cn(
        "flex gap-3 rounded-md border px-4 py-3 text-sm leading-relaxed",
        variant === "blue" &&
          "border-blue-200/60 bg-notion-callout-blue dark:border-blue-900/40",
        variant === "yellow" &&
          "border-amber-200/60 bg-notion-callout-yellow dark:border-amber-900/40",
        className,
      )}
    >
      <span className="text-lg leading-none">{icon}</span>
      <div className="min-w-0 flex-1">
        {title && <p className="mb-1 font-medium">{title}</p>}
        <div className="text-foreground/90">{children}</div>
      </div>
    </div>
  );
}
