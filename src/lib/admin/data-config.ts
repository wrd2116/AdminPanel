export type DataMode = "read" | "update" | "crud";

export type AdminDataConfig = {
  slug: string;
  label: string;
  table: string;
  mode: DataMode;
  description: string;
};

export const adminDataConfigs: AdminDataConfig[] = [
  {
    slug: "humor-flavors",
    label: "Humor flavors",
    table: "humor_flavors",
    mode: "read",
    description: "Read-only list of humor flavor definitions.",
  },
  {
    slug: "humor-flavor-steps",
    label: "Humor flavor steps",
    table: "humor_flavor_steps",
    mode: "read",
    description: "Read-only sequencing and step metadata for flavor pipelines.",
  },
  {
    slug: "humor-mix",
    label: "Humor mix",
    table: "humor_mix",
    mode: "update",
    description: "Read and update humor mix rows.",
  },
  {
    slug: "terms",
    label: "Terms",
    table: "terms",
    mode: "crud",
    description: "Create, read, update, and delete terms.",
  },
  {
    slug: "caption-requests",
    label: "Caption requests",
    table: "caption_requests",
    mode: "read",
    description: "Read-only stream of caption generation requests.",
  },
  {
    slug: "caption-examples",
    label: "Caption examples",
    table: "caption_examples",
    mode: "crud",
    description: "Create, read, update, and delete training examples.",
  },
  {
    slug: "llm-models",
    label: "LLM models",
    table: "llm_models",
    mode: "crud",
    description: "Create, read, update, and delete LLM model records.",
  },
  {
    slug: "llm-providers",
    label: "LLM providers",
    table: "llm_providers",
    mode: "crud",
    description: "Create, read, update, and delete LLM provider records.",
  },
  {
    slug: "llm-prompt-chains",
    label: "LLM prompt chains",
    table: "llm_prompt_chains",
    mode: "read",
    description: "Read-only prompt chain definitions.",
  },
  {
    slug: "llm-responses",
    label: "LLM responses",
    table: "llm_responses",
    mode: "read",
    description: "Read-only history of LLM responses.",
  },
  {
    slug: "allowed-signup-domains",
    label: "Allowed signup domains",
    table: "allowed_signup_domains",
    mode: "crud",
    description: "Create, read, update, and delete approved signup domains.",
  },
  {
    slug: "whitelisted-email-addresses",
    label: "Whitelisted email addresses",
    table: "whitelisted_email_addresses",
    mode: "crud",
    description: "Create, read, update, and delete email allowlist entries.",
  },
];

export function getAdminDataConfig(slug: string): AdminDataConfig | null {
  return adminDataConfigs.find((c) => c.slug === slug) ?? null;
}

export function getAdminDataConfigByTable(table: string): AdminDataConfig | null {
  return adminDataConfigs.find((c) => c.table === table) ?? null;
}
