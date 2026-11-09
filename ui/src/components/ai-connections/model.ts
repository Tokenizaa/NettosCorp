/**
 * Registro de provedores de IA para a UI.
 * Cada entrada define o nome de exibição utilizado no select de provedores.
 */

export const AI_CONNECTION_PROVIDERS: Record<string, { name: string }> = {
  openai: { name: "OpenAI" },
  anthropic: { name: "Anthropic" },
  google: { name: "Google" },
  cohere: { name: "Cohere" },
  nvidia: { name: "NVIDIA NIM" },
} as const;

export type AIConnectionProvider = keyof typeof AI_CONNECTION_PROVIDERS;

export function getProviderName(provider: AIConnectionProvider): string {
  return AI_CONNECTION_PROVIDERS[provider]?.name ?? provider;
}

export function getProviderList(): Array<{ value: AIConnectionProvider; label: string }> {
  return Object.entries(AI_CONNECTION_PROVIDERS).map(
    ([value, info]) => ({ value: value as AIConnectionProvider, label: info.name }),
  );
}
