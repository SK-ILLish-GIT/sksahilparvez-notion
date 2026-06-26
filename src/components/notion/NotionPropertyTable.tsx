import type { ReactNode } from "react";

export interface NotionPropertyRow {
  label: string;
  value: ReactNode;
}

export function NotionPropertyTable({ rows }: { rows: NotionPropertyRow[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div className="grid grid-cols-[minmax(100px,0.9fr)_minmax(0,1.6fr)] bg-muted/40 px-3 py-2 text-xs font-medium text-muted-foreground">
        <span>Property</span>
        <span>Value</span>
      </div>
      {rows.map((row) => (
        <div
          key={row.label}
          className="grid grid-cols-[minmax(100px,0.9fr)_minmax(0,1.6fr)] gap-3 border-t border-border px-3 py-2.5 text-sm"
        >
          <span className="text-muted-foreground">{row.label}</span>
          <div className="min-w-0 leading-relaxed">{row.value}</div>
        </div>
      ))}
    </div>
  );
}
