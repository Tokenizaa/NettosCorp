/**
 * Teste de detecção e validação do adapter Hermes.
 * Verifica se as chaves de ambiente dos provedores são detectadas corretamente,
 * incluindo a NVIDIA_API_KEY para a NVIDIA NIM, e se o Python está disponível
 * no ambiente de execução (compatível com Windows, Linux e macOS).
 */

import { AI_PROVIDER_CAPABILITIES } from "@paperclip/shared";
import { TEST_ENV_KEYS } from "./detect-model.test";
import { execSync } from "child_process";

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

/**
 * Executáveis do Python candidatos, em ordem de preferência por plataforma.
 * No Windows tenta-se `python`, `py` e `python3`; no Linux/macOS, `python3` e `python`.
 */
const PYTHON_CANDIDATES = process.platform === "win32"
  ? ["python", "py", "python3"]
  : ["python3", "python"];

/**
 * Versão mínima do Python exigida pelo Hermes Agent.
 */
const MIN_PYTHON_MAJOR = 3;
const MIN_PYTHON_MINOR = 10;

/**
 * Tenta detectar um executável Python funcional no ambiente.
 * Retorna o caminho/nome do executável encontrado ou undefined se nenhum for válido.
 */
export function detectPython(): string | undefined {
  for (const candidate of PYTHON_CANDIDATES) {
    try {
      const output = execSync(`${candidate} --version`, {
        encoding: "utf8",
        stdio: ["pipe", "pipe", "pipe"],
        timeout: 5000,
      });
      const match = output.match(/Python\s+(\d+)\.(\d+)/);
      if (match) {
        const major = Number(match[1]!);
        const minor = Number(match[2]!);
        if (
          major > MIN_PYTHON_MAJOR ||
          (major === MIN_PYTHON_MAJOR && minor >= MIN_PYTHON_MINOR)
        ) {
          return candidate;
        }
      }
    } catch {
      // Candidato não disponível ou inválido — tenta o próximo
      continue;
    }
  }
  return undefined;
}

/**
 * Resultado da validação de ambiente, incluindo a detecção do Python.
 */
export interface EnvironmentValidation {
  valid: boolean;
  missing: string[];
  hint: string;
  python: { detected: boolean; executable?: string };
}

export function detectProviderEnvKeys(): string[] {
  return TEST_ENV_KEYS;
}

export function validateEnvironment(env: Record<string, string>): EnvironmentValidation {
  const missing: string[] = [];

  for (const [provider, keys] of Object.entries(EXPECTED_ENV_KEYS)) {
    const hasKey = keys.some((key) => Boolean(env[key]));
    if (!hasKey) {
      missing.push(...keys);
    }
  }

  const python = detectPython();

  return {
    valid: missing.length === 0 && python !== undefined,
    missing,
    hint: MISSING_API_KEY_HINT,
    python: {
      detected: python !== undefined,
      executable: python,
    },
  };
}

export function getNvidiaEnvKey(): string {
  const nvidiaCaps = AI_PROVIDER_CAPABILITIES.nvidia;
  const apiKeyMethod = nvidiaCaps.methods["api_key"];
  if (!apiKeyMethod) {
    throw new Error("NVIDIA API key method not configured");
  }
  return apiKeyMethod.envKey;
}
