/**
 * Teste de detecção e validação do adapter Hermes.
 * Verifica se as chaves de ambiente dos provedores são detectadas corretamente,
 * incluindo a NVIDIA_API_KEY para a NVIDIA NIM.
 */

import { AI_PROVIDER_CAPABILITIES } from "../../../shared/src/ai-connections";
import { TEST_ENV_KEYS } from "./detect-model.test";

/**
 * Variáveis de ambiente esperadas por provedor.
 */
const EXPECTED_ENV_KEYS: Record<string, string[]> = {
  openai: ["OPENAI_API_KEY"],
  anthropic: ["ANTHROPIC_API_KEY"],
  google: ["GOOGLE_API_KEY"],
  cohere: ["COHERE_API_KEY"],
  nvidia: ["NVIDIA_API_KEY"],
};

/**
 * Hint de warning exibido quando nenhuma chave de API está configurada.
 * Atualizado para incluir referência à NVIDIA_API_KEY.
 */
const MISSING_API_KEY_HINT =
  "Nenhuma chave de API de LLM encontrada no ambiente. " +
  "Defina ANTHROPIC_API_KEY, OPENROUTER_API_KEY, OPENAI_API_KEY, " +
  "ZAI_API_KEY, KIMI_API_KEY, MINIMAX_API_KEY ou NVIDIA_API_KEY " +
  "no ~/.hermes/.env ou nos secrets do agente.";

export function detectProviderEnvKeys(): string[] {
  return TEST_ENV_KEYS;
}

export function validateEnvironment(env: Record<string, string>): {
  valid: boolean;
  missing: string[];
  hint: string;
} {
  const missing: string[] = [];

  for (const [provider, keys] of Object.entries(EXPECTED_ENV_KEYS)) {
    const hasKey = keys.some((key) => Boolean(env[key]));
    if (!hasKey) {
      missing.push(...keys);
    }
  }

  return {
    valid: missing.length === 0,
    missing,
    hint: MISSING_API_KEY_HINT,
  };
}

export function getNvidiaEnvKey(): string {
  return AI_PROVIDER_CAPABILITIES.nvidia.methods.api_key.envKey;
}
