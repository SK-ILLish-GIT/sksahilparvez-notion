import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CheckboxField,
  FieldGroup,
  NumberField,
  NumberListField,
  SelectField,
  StringListField,
  TextAreaField,
  TextField,
} from "@/components/admin/AdminFields";
import {
  asArray,
  asBoolean,
  asNumber,
  asNumberList,
  asRecord,
  asString,
  asStringList,
  getPath,
  setPath,
} from "@/components/admin/object-path";
import type { AdminSchema, FieldSchema } from "@/components/admin/schemas";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, GripVertical, Trash2 } from "lucide-react";

function FieldRenderer({
  field,
  record,
  onChange,
  prefix,
}: {
  field: FieldSchema;
  record: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
  prefix: string;
}) {
  const id = `${prefix}-${field.type === "group" ? field.label : field.key}`;

  if (field.type === "group") {
    return (
      <FieldGroup label={field.label}>
        {field.fields.map((child) => (
          <FieldRenderer
            key={child.type === "group" ? child.label : child.key}
            field={child}
            record={record}
            onChange={onChange}
            prefix={prefix}
          />
        ))}
      </FieldGroup>
    );
  }

  const value = getPath(record, field.key);

  const patch = (nextValue: unknown) => {
    onChange(setPath(record, field.key, nextValue));
  };

  switch (field.type) {
    case "text":
      return (
        <TextField
          id={id}
          label={field.label}
          value={asString(value)}
          placeholder={field.placeholder}
          wide={field.wide}
          onChange={patch}
        />
      );
    case "textarea":
      return (
        <TextAreaField
          id={id}
          label={field.label}
          value={asString(value)}
          rows={field.rows}
          onChange={patch}
        />
      );
    case "number":
      return (
        <NumberField
          id={id}
          label={field.label}
          value={asNumber(value)}
          onChange={patch}
        />
      );
    case "checkbox":
      return (
        <CheckboxField
          id={id}
          label={field.label}
          checked={asBoolean(value)}
          onChange={patch}
        />
      );
    case "select":
      return (
        <SelectField
          id={id}
          label={field.label}
          value={asString(value) || field.options[0]?.value || ""}
          options={field.options}
          onChange={patch}
        />
      );
    case "string-list":
      return (
        <StringListField
          id={id}
          label={field.label}
          values={asStringList(value)}
          onChange={patch}
        />
      );
    case "number-list":
      return (
        <NumberListField
          id={id}
          label={field.label}
          values={asNumberList(value)}
          onChange={patch}
        />
      );
    default:
      return null;
  }
}

function ItemCard({
  title,
  open,
  onToggle,
  onRemove,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  onRemove: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border bg-muted/30 px-3 py-2">
        <GripVertical className="size-4 shrink-0 text-muted-foreground/50" />
        <button
          type="button"
          onClick={onToggle}
          className="flex min-w-0 flex-1 items-center gap-2 text-left text-sm font-medium"
        >
          {open ? (
            <ChevronDown className="size-4 shrink-0" />
          ) : (
            <ChevronRight className="size-4 shrink-0" />
          )}
          <span className="truncate">{title}</span>
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          aria-label="Remove item"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
      {open && <div className="grid gap-3 p-4 md:grid-cols-2">{children}</div>}
    </div>
  );
}

function ObjectForm({
  fields,
  record,
  onChange,
  prefix,
}: {
  fields: FieldSchema[];
  record: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
  prefix: string;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {fields.map((field) => (
        <FieldRenderer
          key={field.type === "group" ? field.label : field.key}
          field={field}
          record={record}
          onChange={onChange}
          prefix={prefix}
        />
      ))}
    </div>
  );
}

function ArrayForm({
  schema,
  items,
  onChange,
  prefix,
}: {
  schema: Extract<AdminSchema, { kind: "array" }>;
  items: Record<string, unknown>[];
  onChange: (items: Record<string, unknown>[]) => void;
  prefix: string;
}) {
  const [openIndex, setOpenIndex] = useState(0);

  const updateItem = (index: number, next: Record<string, unknown>) => {
    const copy = [...items];
    copy[index] = next;
    onChange(copy);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
    setOpenIndex(Math.max(0, index - 1));
  };

  const addItem = () => {
    onChange([...items, schema.defaultItem()]);
    setOpenIndex(items.length);
  };

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <ItemCard
          key={`${prefix}-${index}-${asString(item.id)}`}
          title={schema.itemLabel(item, index)}
          open={openIndex === index}
          onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
          onRemove={() => removeItem(index)}
        >
          <ObjectForm
            fields={schema.fields}
            record={item}
            onChange={(next) => updateItem(index, next)}
            prefix={`${prefix}-${index}`}
          />
        </ItemCard>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={addItem}>
        + Add entry
      </Button>
    </div>
  );
}

function NestedArrayForm({
  schema,
  items,
  onChange,
  prefix,
}: {
  schema: Extract<AdminSchema, { kind: "nested-array" }>;
  items: Record<string, unknown>[];
  onChange: (items: Record<string, unknown>[]) => void;
  prefix: string;
}) {
  const [openIndex, setOpenIndex] = useState(0);

  const updateItem = (index: number, next: Record<string, unknown>) => {
    const copy = [...items];
    copy[index] = next;
    onChange(copy);
  };

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const nested = asArray(item[schema.nestedKey]);
        return (
          <ItemCard
            key={`${prefix}-${index}-${asString(item.id)}`}
            title={schema.itemLabel(item, index)}
            open={openIndex === index}
            onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
            onRemove={() => onChange(items.filter((_, i) => i !== index))}
          >
            <ObjectForm
              fields={schema.fields}
              record={item}
              onChange={(next) => updateItem(index, next)}
              prefix={`${prefix}-${index}`}
            />
            <div className="col-span-full space-y-2 border-t border-border pt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {schema.nestedLabel}
              </p>
              {nested.map((child, childIndex) => (
                <div
                  key={`${prefix}-nested-${childIndex}`}
                  className="grid gap-2 rounded-md border border-border/70 bg-muted/10 p-3 md:grid-cols-2"
                >
                  <ObjectForm
                    fields={schema.nestedFields}
                    record={child}
                    onChange={(nextChild) => {
                      const nextNested = [...nested];
                      nextNested[childIndex] = nextChild;
                      updateItem(index, {
                        ...item,
                        [schema.nestedKey]: nextNested,
                      });
                    }}
                    prefix={`${prefix}-${index}-${childIndex}`}
                  />
                  <div className="col-span-full flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        updateItem(index, {
                          ...item,
                          [schema.nestedKey]: nested.filter(
                            (_, i) => i !== childIndex,
                          ),
                        });
                      }}
                      className="text-xs text-destructive hover:underline"
                    >
                      Remove skill
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  updateItem(index, {
                    ...item,
                    [schema.nestedKey]: [...nested, schema.nestedDefaultItem()],
                  });
                }}
                className="text-xs font-medium text-primary hover:underline"
              >
                + Add skill
              </button>
            </div>
          </ItemCard>
        );
      })}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => {
          onChange([...items, schema.defaultItem()]);
          setOpenIndex(items.length);
        }}
      >
        + Add group
      </Button>
    </div>
  );
}

export function DynamicEditor({
  schema,
  data,
  onChange,
  sectionKey,
}: {
  schema: AdminSchema;
  data: unknown;
  onChange: (data: unknown) => void;
  sectionKey: string;
}) {
  if (schema.kind === "object") {
    const record = asRecord(data);
    return (
      <ObjectForm
        fields={schema.fields}
        record={record}
        onChange={(next) => onChange(next)}
        prefix={sectionKey}
      />
    );
  }

  if (schema.kind === "array") {
    return (
      <ArrayForm
        schema={schema}
        items={asArray(data)}
        onChange={onChange}
        prefix={sectionKey}
      />
    );
  }

  return (
    <NestedArrayForm
      schema={schema}
      items={asArray(data)}
      onChange={onChange}
      prefix={sectionKey}
    />
  );
}

export function JsonEditor({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      spellCheck={false}
      className={cn(
        "min-h-[480px] w-full rounded-lg border border-border bg-background p-4 font-mono text-xs leading-relaxed outline-none focus-visible:ring-2 focus-visible:ring-ring",
        disabled && "opacity-60",
      )}
    />
  );
}
