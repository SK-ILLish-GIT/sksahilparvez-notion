import { lazy, Suspense } from "react";
import { portfolio } from "@/data";
import { cn } from "@/lib/utils";

const Cal = lazy(() =>
  import("@calcom/embed-react").then((mod) => ({ default: mod.default })),
);

interface CalEmbedProps {
  className?: string;
}

export function CalEmbed({ className }: CalEmbedProps) {
  const calLink = portfolio.site.calLink;

  if (!calLink) {
    return (
      <div className="rounded-md border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        Add your Cal.com link in <code>src/data/content/site.json</code>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-md border border-border bg-card",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-border px-3 py-2 text-xs text-muted-foreground">
        <span>Embed</span>
        <span className="text-foreground/60">·</span>
        <span>cal.com</span>
      </div>
      <Suspense
        fallback={
          <div className="flex h-[500px] items-center justify-center text-sm text-muted-foreground">
            Loading calendar…
          </div>
        }
      >
        <Cal
          calLink={calLink}
          style={{
            width: "100%",
            height: "630px",
            overflow: "scroll",
          }}
          config={{ layout: "month_view" }}
        />
      </Suspense>
    </div>
  );
}
