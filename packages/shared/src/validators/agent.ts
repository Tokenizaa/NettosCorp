import { z } from "zod";

/**
 * Schema de validação das variáveis de ambiente de um adapter.
 * Cada provedor pode exigir uma ou mais variáveis de ambiente para autenticação.
 */
export const testAdapterEnvironmentSchema = z.object({
  OPENAI_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  GOOGLE_API_KEY: z.string().optional(),
  COHERE_API_KEY: z.string().optional(),
  NVIDIA_API_KEY: z.string().optional(),
});

export type TestAdapterEnvironment = z.infer<
  typeof testAdapterEnvironmentSchema
> & Record<string, string | undefined>;

/**
 * Valida se pelo menos uma chave de API relevante está presente para o provedor informado.
 */
export function validateAdapterEnvironment(
  env: TestAdapterEnvironment,
  provider: string,
): { valid: boolean; missing?: string[] } {
  const requiredKeys: Record<string, string[]> = {
    openai: ["OPENAI_API_KEY"],
    anthropic: ["ANTHROPIC_API_KEY"],
    google: ["GOOGLE_API_KEY"],
    cohere: ["COHERE_API_KEY"],
    nvidia: ["NVIDIA_API_KEY"],
  };

  const keys = requiredKeys[provider] || [];
  const missing = keys.filter((key) => !env[key]);

  return {
    valid: missing.length === 0,
    missing: missing.length > 0 ? missing : undefined,
  };
}
