import { cn } from "@/lib/utils";

export function adminInputClass(wide?: boolean) {
  return cn(
    "rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring",
    wide ? "col-span-full" : "",
  );
}

export function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-xs font-medium text-muted-foreground"
    >
      {children}
    </label>
  );
}

export function TextField({
  id,
  label,
  value,
  onChange,
  placeholder,
  wide,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  wide?: boolean;
}) {
  return (
    <div className={cn("space-y-1.5", wide && "md:col-span-2")}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <input
        id={id}
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={cn(adminInputClass(), "w-full")}
      />
    </div>
  );
}

export function NumberField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <input
        id={id}
        type="number"
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => onChange(Number(e.target.value))}
        className={cn(adminInputClass(), "w-full")}
      />
    </div>
  );
}

export function TextAreaField({
  id,
  label,
  value,
  onChange,
  rows = 4,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <div className="col-span-full space-y-1.5">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <textarea
        id={id}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(adminInputClass(), "w-full resize-y")}
      />
    </div>
  );
}

export function CheckboxField({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-center gap-2 rounded-md border border-border bg-muted/20 px-3 py-2.5 text-sm"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="size-4 rounded border-border"
      />
      {label}
    </label>
  );
}

export function SelectField({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="space-y-1.5">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(adminInputClass(), "w-full")}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function StringListField({
  id,
  label,
  values,
  onChange,
}: {
  id: string;
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
}) {
  const update = (index: number, value: string) => {
    const next = [...values];
    next[index] = value;
    onChange(next);
  };

  return (
    <div className="col-span-full space-y-2">
      <FieldLabel htmlFor={`${id}-0`}>{label}</FieldLabel>
      <div className="space-y-2">
        {values.map((value, index) => (
          <div key={`${id}-${index}`} className="flex gap-2">
            <input
              id={index === 0 ? `${id}-0` : undefined}
              type="text"
              value={value}
              onChange={(e) => update(index, e.target.value)}
              className={cn(adminInputClass(), "min-w-0 flex-1")}
            />
            <button
              type="button"
              onClick={() => onChange(values.filter((_, i) => i !== index))}
              className="rounded-md border border-border px-2 text-xs text-muted-foreground hover:bg-muted"
              aria-label="Remove item"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...values, ""])}
          className="text-xs font-medium text-primary hover:underline"
        >
          + Add item
        </button>
      </div>
    </div>
  );
}

export function NumberListField({
  id,
  label,
  values,
  onChange,
}: {
  id: string;
  label: string;
  values: number[];
  onChange: (values: number[]) => void;
}) {
  const text = values.join(", ");

  return (
    <div className="col-span-full space-y-1.5">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <input
        id={id}
        type="text"
        value={text}
        placeholder="560, 570, 776"
        onChange={(e) => {
          const parsed = e.target.value
            .split(",")
            .map((part) => part.trim())
            .filter(Boolean)
            .map((part) => Number(part))
            .filter((n) => Number.isFinite(n));
          onChange(parsed);
        }}
        className={cn(adminInputClass(), "w-full")}
      />
    </div>
  );
}

export function FieldGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="col-span-full space-y-3 rounded-lg border border-border bg-muted/10 p-4">
      <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </legend>
      <div className="grid gap-3 md:grid-cols-2">{children}</div>
    </fieldset>
  );
}
