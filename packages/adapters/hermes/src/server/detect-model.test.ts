import { describe, it, expect } from "vitest";
import { detectProviderByModelPrefix } from "../shared/constants";

/**
 * Chaves de ambiente utilizadas nos testes de detecção de modelo.
 * Inclui NVIDIA_API_KEY para o provedor NVIDIA NIM.
 */
export const TEST_ENV_KEYS = [
  "OPENAI_API_KEY",
  "ANTHROPIC_API_KEY",
  "GOOGLE_API_KEY",
  "COHERE_API_KEY",
  "NVIDIA_API_KEY",
];

describe("detectProviderByModelPrefix", () => {
  it("infere 'nvidia' para modelos com prefixo 'nemotron'", () => {
    expect(detectProviderByModelPrefix("nemotron-3.5-super-vl-120b-a12b")).toBe(
      "nvidia",
    );
  });

  it("infere 'nvidia' para modelos com prefixo 'nvidia'", () => {
    expect(detectProviderByModelPrefix("nvidia-some-model")).toBe("nvidia");
  });

  it("infere 'openai' para modelos com prefixo 'gpt'", () => {
    expect(detectProviderByModelPrefix("gpt-4")).toBe("openai");
  });

  it("retorna undefined quando nenhum prefixo corresponde", () => {
    expect(detectProviderByModelPrefix("unknown-model")).toBeUndefined();
  });
});
