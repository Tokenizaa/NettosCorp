import { expect, test } from "vitest";
import {
  verificarIndependentemente,
  registrarEvidenciaNoResultado,
  CRITERIOS_PADRAO,
} from "./verificacao-independente.js";

test("aprova quando todos os critérios são atendidos e agentes são diferentes", () => {
  const resultado = {
    exitCode: 0,
    signal: null,
    timedOut: false,
    summary: "execução concluída com sucesso",
    resultJson: {},
  } as any;

  const v = verificarIndependentemente(
    resultado,
    CRITERIOS_PADRAO,
    "qa-tester-1",
    "hermes-diretor",
  );

  expect(v.status).toBe("aprovado");
  expect(v.podeEncerrar).toBe(true);
  expect(v.resumo).toContain("aprovada");
  expect(v.criterios).toHaveLength(3);
  expect(v.criterios.every((c) => c.aprovado)).toBe(true);
  expect(v.criterios.every((c) => c.verificadoPor === "qa-tester-1")).toBe(true);
});

test("reprova quando o verificador é o mesmo que implementou", () => {
  const resultado = {
    exitCode: 0,
    signal: null,
    timedOut: false,
    summary: "ok",
    resultJson: {},
  } as any;

  const v = verificarIndependentemente(
    resultado,
    CRITERIOS_PADRAO,
    "hermes-diretor",
    "hermes-diretor",
  );

  expect(v.status).toBe("reprovado");
  expect(v.podeEncerrar).toBe(false);
  expect(v.resumo).toContain("mesmo que implementou");
});

test("reprova quando há erro de execução", () => {
  const resultado = {
    exitCode: 1,
    signal: null,
    timedOut: false,
    summary: "falhou",
    errorMessage: "algo deu errado",
    resultJson: {},
  } as any;

  const v = verificarIndependentemente(
    resultado,
    CRITERIOS_PADRAO,
    "qa-tester-1",
    "hermes-diretor",
  );

  expect(v.status).toBe("reprovado");
  expect(v.podeEncerrar).toBe(false);
  expect(v.criterios.some((c) => !c.aprovado)).toBe(true);
});

test("reprova quando há timeout", () => {
  const resultado = {
    exitCode: 0,
    signal: null,
    timedOut: true,
    summary: "timeout",
    resultJson: {},
  } as any;

  const v = verificarIndependentemente(
    resultado,
    CRITERIOS_PADRAO,
    "qa-tester-1",
    "hermes-diretor",
  );

  expect(v.status).toBe("reprovado");
  expect(v.podeEncerrar).toBe(false);
});

test("registra evidência no resultJson", () => {
  const resultado = {
    exitCode: 0,
    signal: null,
    timedOut: false,
    summary: "ok",
    resultJson: { existente: true },
  } as any;

  const v = verificarIndependentemente(
    resultado,
    CRITERIOS_PADRAO,
    "qa-tester-1",
    "hermes-diretor",
  );

  const comEvidencia = registrarEvidenciaNoResultado(resultado, v);
  expect(comEvidencia.resultJson?.verificacao_independente).toBeDefined();
  expect(comEvidencia.resultJson?.verificacao_independente.status).toBe(
    "aprovado",
  );
  expect(comEvidencia.resultJson.existente).toBe(true);
});

test("critérios personalizados funcionam", () => {
  const resultado = {
    exitCode: 0,
    signal: null,
    timedOut: false,
    summary: "arquivo gerado: /tmp/saida.pdf",
    resultJson: {},
  } as any;

  const criterios = [
    {
      id: "arquivo_gerado",
      descricao: "O arquivo de saída foi gerado.",
      verificar: (r) => Boolean(r.summary && r.summary.includes(".pdf")),
      evidenciaEsperada: "summary contém .pdf",
    },
  ];

  const v = verificarIndependentemente(
    resultado,
    criterios,
    "qa-tester-1",
    "claude",
  );

  expect(v.status).toBe("aprovado");
  expect(v.criterios[0].aprovado).toBe(true);
});
