import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { DynamicEditor, JsonEditor } from "@/components/admin/DynamicEditor";
import { asArray, asRecord } from "@/components/admin/object-path";
import {
  ADMIN_SCHEMAS,
  PROFILE_PROPERTIES_SCHEMA,
  SITE_CAL_LINKS_SCHEMA,
} from "@/components/admin/schemas";
import { SECTION_GROUPS, SECTION_META } from "@/components/admin/section-meta";
import { fetchContentSection, saveContentSection } from "@/lib/admin-api";
import { cn } from "@/lib/utils";
import { Code2, LayoutTemplate } from "lucide-react";

type EditorMode = "form" | "json";

function ProfileEditor({
  data,
  onChange,
}: {
  data: unknown;
  onChange: (data: unknown) => void;
}) {
  const record = asRecord(data);
  const properties = asArray(record.properties);

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h3 className="text-sm font-semibold">Basic info</h3>
        <DynamicEditor
          schema={ADMIN_SCHEMAS.profile}
          data={record}
          onChange={(next) => onChange({ ...asRecord(next), properties })}
          sectionKey="profile"
        />
      </section>
      <section className="space-y-3">
        <h3 className="text-sm font-semibold">Property pills</h3>
        <p className="text-xs text-muted-foreground">
          Status, role, location, and other hero properties.
        </p>
        <DynamicEditor
          schema={PROFILE_PROPERTIES_SCHEMA}
          data={properties}
          onChange={(next) => onChange({ ...record, properties: next })}
          sectionKey="profile-properties"
        />
      </section>
    </div>
  );
}

function SiteEditor({
  data,
  onChange,
}: {
  data: unknown;
  onChange: (data: unknown) => void;
}) {
  const record = asRecord(data);
  const calLinks = asArray(record.calLinks);

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h3 className="text-sm font-semibold">Site settings</h3>
        <DynamicEditor
          schema={ADMIN_SCHEMAS.site}
          data={record}
          onChange={(next) => onChange({ ...asRecord(next), calLinks })}
          sectionKey="site"
        />
      </section>
      <section className="space-y-3">
        <h3 className="text-sm font-semibold">Cal.com meeting links</h3>
        <DynamicEditor
          schema={SITE_CAL_LINKS_SCHEMA}
          data={calLinks}
          onChange={(next) => onChange({ ...record, calLinks: next })}
          sectionKey="site-cal"
        />
      </section>
    </div>
  );
}

function StructuredEditor({
  sectionKey,
  data,
  onChange,
}: {
  sectionKey: string;
  data: unknown;
  onChange: (data: unknown) => void;
}) {
  if (sectionKey === "profile") {
    return <ProfileEditor data={data} onChange={onChange} />;
  }
  if (sectionKey === "site") {
    return <SiteEditor data={data} onChange={onChange} />;
  }

  const schema = ADMIN_SCHEMAS[sectionKey];
  if (!schema) {
    return (
      <p className="text-sm text-muted-foreground">
        No form schema for this section — use JSON mode.
      </p>
    );
  }

  return (
    <DynamicEditor
      schema={schema}
      data={data}
      onChange={onChange}
      sectionKey={sectionKey}
    />
  );
}

export function AdminContentPanel({ keys }: { keys: string[] }) {
  const orderedKeys = useMemo(
    () =>
      keys.sort((a, b) => {
        const groupA = SECTION_META[a]?.group ?? "Settings";
        const groupB = SECTION_META[b]?.group ?? "Settings";
        const groupDiff =
          SECTION_GROUPS.indexOf(groupA) - SECTION_GROUPS.indexOf(groupB);
        if (groupDiff !== 0) return groupDiff;
        return (SECTION_META[a]?.label ?? a).localeCompare(
          SECTION_META[b]?.label ?? b,
        );
      }),
    [keys],
  );

  const [selectedKey, setSelectedKey] = useState(orderedKeys[0] ?? "profile");
  const [data, setData] = useState<unknown>(null);
  const [jsonText, setJsonText] = useState("");
  const [mode, setMode] = useState<EditorMode>("form");
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadSection = useCallback(async (key: string) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const section = await fetchContentSection(key);
      setData(section.data);
      setJsonText(JSON.stringify(section.data, null, 2));
      setUpdatedAt(section.updatedAt ?? null);
      setDirty(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load section");
      setData(null);
      setJsonText("");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSection(selectedKey);
  }, [selectedKey, loadSection]);

  const selectSection = (key: string) => {
    if (dirty && !window.confirm("Discard unsaved changes?")) return;
    setSelectedKey(key);
    setMode("form");
  };

  const handleStructuredChange = (next: unknown) => {
    setData(next);
    setJsonText(JSON.stringify(next, null, 2));
    setDirty(true);
    setSuccess(null);
  };

  const handleJsonChange = (text: string) => {
    setJsonText(text);
    setDirty(true);
    setSuccess(null);
  };

  const switchMode = (next: EditorMode) => {
    if (next === mode) return;
    if (next === "json") {
      setJsonText(JSON.stringify(data, null, 2));
    } else {
      try {
        setData(JSON.parse(jsonText) as unknown);
        setError(null);
      } catch {
        setError("Fix JSON syntax before switching to form view");
        return;
      }
    }
    setMode(next);
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const payload =
        mode === "json" ? (JSON.parse(jsonText) as unknown) : data;
      const section = await saveContentSection(selectedKey, payload);
      setData(section.data);
      setJsonText(JSON.stringify(section.data, null, 2));
      setUpdatedAt(section.updatedAt ?? null);
      setDirty(false);
      setSuccess(`Saved ${SECTION_META[selectedKey]?.label ?? selectedKey}`);
    } catch (err) {
      if (err instanceof SyntaxError) {
        setError("Invalid JSON — fix syntax before saving");
      } else {
        setError(err instanceof Error ? err.message : "Save failed");
      }
    } finally {
      setSaving(false);
    }
  };

  const meta = SECTION_META[selectedKey];
  const hasFormSchema =
    selectedKey === "profile" ||
    selectedKey === "site" ||
    Boolean(ADMIN_SCHEMAS[selectedKey]);

  return (
    <div className="flex min-h-[calc(100vh-65px)] flex-col lg:flex-row">
      <aside className="w-full shrink-0 border-b border-border bg-muted/20 lg:w-64 lg:border-b-0 lg:border-r">
        <nav className="flex gap-1 overflow-x-auto p-3 lg:flex-col lg:overflow-visible">
          {SECTION_GROUPS.map((group) => {
            const groupKeys = orderedKeys.filter(
              (key) => (SECTION_META[key]?.group ?? "Settings") === group,
            );
            if (groupKeys.length === 0) return null;
            return (
              <div key={group} className="min-w-[140px] lg:min-w-0">
                <p className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {group}
                </p>
                {groupKeys.map((key) => {
                  const item = SECTION_META[key];
                  const active = key === selectedKey;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => selectSection(key)}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors",
                        active
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted",
                      )}
                    >
                      <span>{item?.icon ?? "📄"}</span>
                      <span className="truncate">{item?.label ?? key}</span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </nav>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="sticky top-0 z-10 border-b border-border bg-background/95 px-6 py-4 backdrop-blur">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">
                {meta?.icon} {meta?.label ?? selectedKey}
              </h2>
              <p className="text-xs text-muted-foreground">
                {meta?.description}
                {updatedAt && (
                  <> · Last saved {new Date(updatedAt).toLocaleString()}</>
                )}
                {dirty && (
                  <span className="text-amber-600 dark:text-amber-400">
                    {" "}
                    · Unsaved changes
                  </span>
                )}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {hasFormSchema && (
                <div className="flex rounded-md border border-border p-0.5">
                  <button
                    type="button"
                    onClick={() => switchMode("form")}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs font-medium",
                      mode === "form" && "bg-muted",
                    )}
                  >
                    <LayoutTemplate className="size-3.5" />
                    Form
                  </button>
                  <button
                    type="button"
                    onClick={() => switchMode("json")}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs font-medium",
                      mode === "json" && "bg-muted",
                    )}
                  >
                    <Code2 className="size-3.5" />
                    JSON
                  </button>
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => void loadSection(selectedKey)}
                disabled={loading || saving}
              >
                Reload
              </Button>
              <Button
                size="sm"
                onClick={() => void save()}
                disabled={loading || saving}
              >
                {saving ? "Saving…" : "Save"}
              </Button>
            </div>
          </div>
        </div>

        <div className="px-6 py-6">
          {error && (
            <p className="mb-4 text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
          {success && (
            <p className="mb-4 text-sm text-emerald-600 dark:text-emerald-400">
              {success}
            </p>
          )}

          {loading ? (
            <p className="text-sm text-muted-foreground">Loading section…</p>
          ) : mode === "json" || !hasFormSchema ? (
            <JsonEditor
              value={jsonText}
              onChange={handleJsonChange}
              disabled={loading}
            />
          ) : (
            <StructuredEditor
              sectionKey={selectedKey}
              data={data}
              onChange={handleStructuredChange}
            />
          )}
        </div>
      </div>
    </div>
  );
}
