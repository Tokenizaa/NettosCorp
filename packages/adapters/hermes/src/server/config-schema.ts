import { z } from "zod";

/**
 * Schema de configuração do adapter Hermes.
 * Define os provedores disponíveis no select da UI.
 */

export const AI_PROVIDER_LABELS: Record<string, string> = {
  openai: "OpenAI",
  anthropic: "Anthropic",
  google: "Google",
  cohere: "Cohere",
  nvidia: "NVIDIA NIM",
} as const;

export const providerSelectSchema = z.enum([
  "openai",
  "anthropic",
  "google",
  "cohere",
  "nvidia",
]);

export type ProviderSelect = z.infer<typeof providerSelectSchema>;

export interface ProviderOption {
  value: ProviderSelect;
  label: string;
}

export function getProviderOptions(): ProviderOption[] {
  return (Object.keys(AI_PROVIDER_LABELS) as ProviderSelect[]).map(
    (value) => ({
      value,
      label: AI_PROVIDER_LABELS[value] || value,
    }),
  );
}
