export type FieldSchema =
  | {
      type: "text";
      key: string;
      label: string;
      placeholder?: string;
      wide?: boolean;
    }
  | { type: "textarea"; key: string; label: string; rows?: number }
  | { type: "number"; key: string; label: string }
  | { type: "checkbox"; key: string; label: string }
  | {
      type: "select";
      key: string;
      label: string;
      options: { value: string; label: string }[];
    }
  | { type: "string-list"; key: string; label: string }
  | { type: "number-list"; key: string; label: string }
  | { type: "group"; label: string; fields: FieldSchema[] };

export type AdminSchema =
  | { kind: "object"; fields: FieldSchema[] }
  | {
      kind: "array";
      itemLabel: (item: Record<string, unknown>, index: number) => string;
      fields: FieldSchema[];
      defaultItem: () => Record<string, unknown>;
    }
  | {
      kind: "nested-array";
      itemLabel: (item: Record<string, unknown>, index: number) => string;
      fields: FieldSchema[];
      nestedKey: string;
      nestedLabel: string;
      nestedFields: FieldSchema[];
      nestedDefaultItem: () => Record<string, unknown>;
      defaultItem: () => Record<string, unknown>;
    };

const experienceFields: FieldSchema[] = [
  { type: "text", key: "id", label: "ID", placeholder: "unique-slug" },
  { type: "text", key: "company", label: "Company" },
  { type: "text", key: "role", label: "Role" },
  {
    type: "text",
    key: "period",
    label: "Period",
    placeholder: "Aug 2025 – Present",
  },
  { type: "text", key: "location", label: "Location" },
  {
    type: "text",
    key: "logo",
    label: "Logo path",
    placeholder: "/logos/company.png",
  },
  { type: "textarea", key: "description", label: "Description", rows: 3 },
  { type: "string-list", key: "stack", label: "Tech stack" },
  { type: "string-list", key: "highlights", label: "Highlights" },
  {
    type: "group",
    label: "Metric (optional)",
    fields: [
      { type: "text", key: "metric.label", label: "Metric label" },
      { type: "text", key: "metric.value", label: "Metric value" },
    ],
  },
  {
    type: "group",
    label: "Credential link (optional)",
    fields: [
      { type: "text", key: "credential.label", label: "Link label" },
      { type: "text", key: "credential.href", label: "URL" },
    ],
  },
];

const projectFields: FieldSchema[] = [
  { type: "text", key: "id", label: "ID" },
  { type: "text", key: "name", label: "Name" },
  { type: "text", key: "tagline", label: "Tagline" },
  { type: "text", key: "period", label: "Period" },
  { type: "text", key: "pageIcon", label: "Icon", placeholder: "🚀" },
  {
    type: "select",
    key: "bentoSize",
    label: "Bento size",
    options: [
      { value: "large", label: "Large" },
      { value: "wide", label: "Wide" },
      { value: "tall", label: "Tall" },
      { value: "small", label: "Small" },
    ],
  },
  { type: "text", key: "coverGradient", label: "Cover gradient classes" },
  { type: "checkbox", key: "featured", label: "Featured on bento grid" },
  { type: "string-list", key: "stack", label: "Stack" },
  { type: "string-list", key: "highlights", label: "Highlights" },
  {
    type: "group",
    label: "Links",
    fields: [
      { type: "text", key: "links.github", label: "GitHub URL" },
      { type: "text", key: "links.demo", label: "Demo URL" },
    ],
  },
  {
    type: "group",
    label: "Metric (optional)",
    fields: [
      { type: "text", key: "metric.label", label: "Label" },
      { type: "text", key: "metric.value", label: "Value" },
    ],
  },
  {
    type: "textarea",
    key: "architecture",
    label: "Architecture (fallback)",
    rows: 4,
  },
];

const educationFields: FieldSchema[] = [
  { type: "text", key: "id", label: "ID" },
  { type: "text", key: "institution", label: "Institution" },
  { type: "text", key: "shortTitle", label: "Short title" },
  { type: "text", key: "degree", label: "Degree" },
  {
    type: "text",
    key: "startDate",
    label: "Start date",
    placeholder: "2020-07",
  },
  { type: "text", key: "endDate", label: "End date", placeholder: "2024-06" },
  { type: "text", key: "period", label: "Display period" },
  { type: "text", key: "marks", label: "Marks / GPA" },
  { type: "text", key: "marksLabel", label: "Marks label" },
  { type: "text", key: "rank", label: "Rank" },
  { type: "text", key: "rankLabel", label: "Rank label" },
  { type: "text", key: "location", label: "Location" },
  { type: "text", key: "pageIcon", label: "Icon" },
  {
    type: "select",
    key: "status",
    label: "Status",
    options: [
      { value: "completed", label: "Completed" },
      { value: "in-progress", label: "In progress" },
    ],
  },
  { type: "text", key: "statusLabel", label: "Status label" },
  { type: "textarea", key: "description", label: "Description", rows: 3 },
  { type: "string-list", key: "highlights", label: "Highlights" },
];

export const ADMIN_SCHEMAS: Record<string, AdminSchema> = {
  profile: {
    kind: "object",
    fields: [
      { type: "text", key: "name", label: "Name" },
      { type: "text", key: "title", label: "Title" },
      { type: "text", key: "pageIcon", label: "Page icon" },
      {
        type: "text",
        key: "avatar",
        label: "Avatar path",
        placeholder: "/sk_sahil.jpeg",
      },
      { type: "text", key: "tagline", label: "Tagline", wide: true },
      { type: "textarea", key: "summary", label: "Summary", rows: 4 },
      {
        type: "string-list",
        key: "taglineRotation",
        label: "Rotating tagline phrases",
      },
    ],
  },
  site: {
    kind: "object",
    fields: [
      { type: "text", key: "workspaceName", label: "Workspace name" },
      { type: "text", key: "lastUpdated", label: "Last updated label" },
      { type: "text", key: "cvPath", label: "CV URL", wide: true },
      { type: "text", key: "coverImage", label: "Cover image path" },
      {
        type: "text",
        key: "coverGradient",
        label: "Cover gradient CSS",
        wide: true,
      },
      { type: "text", key: "github", label: "GitHub URL", wide: true },
      { type: "text", key: "linkedin", label: "LinkedIn URL", wide: true },
      { type: "text", key: "twitter", label: "X / Twitter URL", wide: true },
      { type: "text", key: "whatsapp", label: "WhatsApp URL", wide: true },
    ],
  },
  sections: {
    kind: "array",
    itemLabel: (item) => `${item.icon ?? "📄"} ${item.label ?? "Section"}`,
    defaultItem: () => ({
      id: "new-section",
      label: "New section",
      icon: "📄",
      visible: true,
    }),
    fields: [
      { type: "text", key: "id", label: "ID" },
      { type: "text", key: "label", label: "Label" },
      { type: "text", key: "icon", label: "Icon" },
      { type: "checkbox", key: "visible", label: "Visible in sidebar" },
    ],
  },
  heroStats: {
    kind: "array",
    itemLabel: (item) => String(item.label ?? "Stat"),
    defaultItem: () => ({
      id: "stat",
      label: "New stat",
      value: 0,
      suffix: "",
    }),
    fields: [
      { type: "text", key: "id", label: "ID" },
      { type: "text", key: "label", label: "Label" },
      { type: "number", key: "value", label: "Value" },
      { type: "text", key: "suffix", label: "Suffix", placeholder: "+ or ★" },
    ],
  },
  contact: {
    kind: "array",
    itemLabel: (item) => String(item.label ?? "Contact"),
    defaultItem: () => ({
      label: "New link",
      value: "",
      href: "",
      logo: "",
    }),
    fields: [
      { type: "text", key: "label", label: "Label" },
      { type: "text", key: "value", label: "Display value" },
      { type: "text", key: "href", label: "URL", wide: true },
      { type: "text", key: "logo", label: "Logo path" },
    ],
  },
  experience: {
    kind: "array",
    itemLabel: (item) =>
      `${item.role ?? "Role"} @ ${item.company ?? "Company"}`,
    defaultItem: () => ({
      id: "new-role",
      company: "",
      role: "",
      period: "",
      location: "",
      stack: [],
      highlights: [],
      description: "",
    }),
    fields: experienceFields,
  },
  projects: {
    kind: "array",
    itemLabel: (item) => String(item.name ?? "Project"),
    defaultItem: () => ({
      id: "new-project",
      name: "",
      tagline: "",
      period: "",
      pageIcon: "🚀",
      stack: [],
      links: {},
      featured: false,
      bentoSize: "small",
      coverGradient: "from-neutral-600 to-neutral-900",
      highlights: [],
    }),
    fields: projectFields,
  },
  education: {
    kind: "array",
    itemLabel: (item) => String(item.institution ?? "School"),
    defaultItem: () => ({
      id: "new-edu",
      institution: "",
      shortTitle: "",
      degree: "",
      startDate: "",
      endDate: "",
      marks: "",
      status: "completed",
      statusLabel: "Completed",
      pageIcon: "🎓",
      description: "",
      highlights: [],
    }),
    fields: educationFields,
  },
  certifications: {
    kind: "array",
    itemLabel: (item) => String(item.title ?? "Certification"),
    defaultItem: () => ({
      id: "new-cert",
      text: "",
      title: "",
      issuer: "",
      status: "todo",
      pageIcon: "📜",
      description: "",
      highlights: [],
    }),
    fields: [
      { type: "text", key: "id", label: "ID" },
      { type: "text", key: "title", label: "Title" },
      { type: "text", key: "issuer", label: "Issuer" },
      { type: "text", key: "period", label: "Period" },
      { type: "text", key: "pageIcon", label: "Icon" },
      {
        type: "select",
        key: "status",
        label: "Kanban column",
        options: [
          { value: "todo", label: "To do" },
          { value: "in-progress", label: "In progress" },
          { value: "done", label: "Done" },
        ],
      },
      { type: "text", key: "link", label: "Credential URL", wide: true },
      { type: "textarea", key: "description", label: "Description", rows: 3 },
      { type: "string-list", key: "highlights", label: "Highlights" },
    ],
  },
  volunteer: {
    kind: "array",
    itemLabel: (item) => String(item.title ?? "Volunteer"),
    defaultItem: () => ({
      id: "new-volunteer",
      text: "",
      title: "",
      role: "",
      pageIcon: "🤝",
      done: false,
      description: "",
      highlights: [],
    }),
    fields: [
      { type: "text", key: "id", label: "ID" },
      { type: "text", key: "title", label: "Title" },
      { type: "text", key: "role", label: "Role" },
      { type: "text", key: "period", label: "Period" },
      { type: "text", key: "pageIcon", label: "Icon" },
      { type: "checkbox", key: "done", label: "Completed" },
      { type: "textarea", key: "description", label: "Description", rows: 3 },
      { type: "string-list", key: "highlights", label: "Highlights" },
    ],
  },
  recommendations: {
    kind: "array",
    itemLabel: (item) => String(item.name ?? "Recommendation"),
    defaultItem: () => ({
      id: "new-rec",
      name: "",
      role: "",
      date: "",
      relationship: "",
      text: "",
      stack: [],
    }),
    fields: [
      { type: "text", key: "id", label: "ID" },
      { type: "text", key: "name", label: "Name" },
      { type: "text", key: "role", label: "Role / title" },
      { type: "text", key: "date", label: "Date" },
      { type: "text", key: "relationship", label: "Relationship", wide: true },
      { type: "text", key: "avatar", label: "Avatar path" },
      { type: "text", key: "linkedin", label: "LinkedIn URL", wide: true },
      { type: "textarea", key: "text", label: "Recommendation text", rows: 6 },
      { type: "string-list", key: "stack", label: "Topic tags" },
    ],
  },
  achievements: {
    kind: "array",
    itemLabel: (item) => String(item.platform ?? "Platform"),
    defaultItem: () => ({
      platform: "",
      codolioPlatform: "",
      ratingProfile: { handle: "", href: "" },
      countProfile: { handle: "", href: "" },
      rating: "",
      bestRanks: [],
      fallbackProblems: 0,
    }),
    fields: [
      { type: "text", key: "platform", label: "Platform name" },
      { type: "text", key: "codolioPlatform", label: "Codolio key" },
      { type: "text", key: "logo", label: "Logo path" },
      { type: "text", key: "rating", label: "Rating label" },
      {
        type: "number",
        key: "fallbackProblems",
        label: "Fallback problem count",
      },
      {
        type: "number-list",
        key: "bestRanks",
        label: "Best ranks (comma-separated)",
      },
      {
        type: "group",
        label: "Rating profile",
        fields: [
          { type: "text", key: "ratingProfile.handle", label: "Handle" },
          {
            type: "text",
            key: "ratingProfile.href",
            label: "Profile URL",
            wide: true,
          },
        ],
      },
      {
        type: "group",
        label: "Count profile",
        fields: [
          { type: "text", key: "countProfile.handle", label: "Handle" },
          {
            type: "text",
            key: "countProfile.href",
            label: "Profile URL",
            wide: true,
          },
        ],
      },
    ],
  },
  skills: {
    kind: "nested-array",
    itemLabel: (item) => `${item.icon ?? "🧠"} ${item.label ?? "Group"}`,
    defaultItem: () => ({
      id: "new-group",
      label: "New group",
      icon: "🧠",
      coverGradient: "from-blue-500 to-indigo-600",
      items: [],
    }),
    fields: [
      { type: "text", key: "id", label: "Group ID" },
      { type: "text", key: "label", label: "Label" },
      { type: "text", key: "icon", label: "Icon" },
      {
        type: "text",
        key: "coverGradient",
        label: "Cover gradient",
        wide: true,
      },
    ],
    nestedKey: "items",
    nestedLabel: "Skills in group",
    nestedFields: [
      { type: "text", key: "name", label: "Name" },
      { type: "text", key: "logo", label: "Logo path" },
    ],
    nestedDefaultItem: () => ({ name: "", logo: "" }),
  },
};

// Profile has a nested properties array — extend schema separately
export const PROFILE_PROPERTIES_SCHEMA: AdminSchema = {
  kind: "array",
  itemLabel: (item) => String(item.label ?? "Property"),
  defaultItem: () => ({
    label: "Label",
    value: "",
    type: "text",
  }),
  fields: [
    { type: "text", key: "label", label: "Label" },
    { type: "text", key: "value", label: "Value" },
    {
      type: "select",
      key: "type",
      label: "Type",
      options: [
        { value: "text", label: "Text" },
        { value: "status", label: "Status pill" },
      ],
    },
    {
      type: "select",
      key: "color",
      label: "Status color",
      options: [
        { value: "green", label: "Green" },
        { value: "yellow", label: "Yellow" },
        { value: "red", label: "Red" },
        { value: "gray", label: "Gray" },
      ],
    },
  ],
};

export const SITE_CAL_LINKS_SCHEMA: AdminSchema = {
  kind: "array",
  itemLabel: (item) => String(item.label ?? "Meeting"),
  defaultItem: () => ({
    id: "meeting",
    label: "15 min",
    hint: "",
    link: "",
  }),
  fields: [
    { type: "text", key: "id", label: "ID" },
    { type: "text", key: "label", label: "Label" },
    { type: "text", key: "hint", label: "Hint" },
    { type: "text", key: "link", label: "Cal.com link slug", wide: true },
  ],
};
