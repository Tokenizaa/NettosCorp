/**
 * Constantes compartilhadas pelo adapter Hermes.
 */

/**
 * Provedores de IA válidos para o adapter Hermes.
 * 'nvidia' foi adicionado para suporte à NVIDIA NIM.
 */
export const VALID_PROVIDERS = [
  "openai",
  "anthropic",
  "google",
  "cohere",
  "nvidia",
] as const;

export type ValidProvider = (typeof VALID_PROVIDERS)[number];

/**
 * Mapeamento de prefixos de modelo para provedores.
 * Usado para inferir o provedor com base no prefixo do nome do modelo.
 * Exemplo: modelos começando com "nemotron" são inferidos como provedor "nvidia".
 */
export const MODEL_PREFIX_PROVIDER_HINTS: Record<string, string[]> = {
  openai: ["gpt", "text", "davinci", "curie", "babbage", "ada"],
  anthropic: ["claude"],
  google: ["gemini", "palm"],
  cohere: ["command"],
  nvidia: ["nemotron", "nvidia"],
} as const;

/**
 * Deteta o provedor com base no prefixo do nome do modelo.
 * Retorna undefined se nenhum prefixo corresponder.
 */
export function detectProviderByModelPrefix(model: string): string | undefined {
  const lower = model.toLowerCase();
  for (const [provider, prefixes] of Object.entries(
    MODEL_PREFIX_PROVIDER_HINTS,
  )) {
    if (prefixes.some((prefix) => lower.startsWith(prefix))) {
      return provider;
    }
  }
  return undefined;
}
