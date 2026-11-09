import { z } from "zod";

/**
 * Lista de provedores de IA aceitos pelo sistema.
 * Cada provedor deve estar representado como uma string literal.
 */
export const AI_PROVIDERS = [
  "openai",
  "anthropic",
  "google",
  "cohere",
  "nvidia",
] as const;

/**
 * Schema Zod que valida o provedor de IA.
 */
export const aiProviderSchema = z.enum(AI_PROVIDERS);

/**
 * Tipo inferido do schema do provedor.
 */
export type AIProvider = z.infer<typeof aiProviderSchema>;

/**
 * Capacidades de cada provedor de IA.
 * Define quais métodos de autenticação são suportados, quais adapters
 * podem ser usados e qual variável de ambiente carrega a chave de API.
 */
export const AI_PROVIDER_CAPABILITIES: Record<
  AIProvider,
  {
    name: string;
    methods: Record<
      string,
      {
        adapters: string[];
        envKey: string;
      }
    >;
  }
> = {
  openai: {
    name: "OpenAI",
    methods: {
      api_key: {
        adapters: ["hermes_local", "openai"],
        envKey: "OPENAI_API_KEY",
      },
    },
  },
  anthropic: {
    name: "Anthropic",
    methods: {
      api_key: {
        adapters: ["hermes_local", "anthropic"],
        envKey: "ANTHROPIC_API_KEY",
      },
    },
  },
  google: {
    name: "Google",
    methods: {
      api_key: {
        adapters: ["hermes_local", "google"],
        envKey: "GOOGLE_API_KEY",
      },
    },
  },
  cohere: {
    name: "Cohere",
    methods: {
      api_key: {
        adapters: ["hermes_local", "cohere"],
        envKey: "COHERE_API_KEY",
      },
    },
  },
  nvidia: {
    name: "NVIDIA NIM",
    methods: {
      api_key: {
        adapters: ["hermes_local"],
        envKey: "NVIDIA_API_KEY",
      },
    },
  },
};

/**
 * Retorna a variável de ambiente de autenticação para um provedor e método.
 */
export function getProviderEnvKey(
  provider: AIProvider,
  method: string = "api_key",
): string | undefined {
  const capabilities = AI_PROVIDER_CAPABILITIES[provider];
  if (!capabilities) return undefined;
  return capabilities.methods[method]?.envKey;
}
