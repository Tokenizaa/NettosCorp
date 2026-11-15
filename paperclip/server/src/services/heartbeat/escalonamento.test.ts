import { expect, test } from "vitest";
import {
  executarComEscalonamento,
  NIVEIS_ORDEM,
  NIVEL_PARAMETROS,
} from "./escalonamento.js";

test("sucesso na primeira tentativa nao escala", async () => {
  let chamadas = 0;
  const r = await executarComEscalonamento(async (nivel) => {
    chamadas++;
    return { exitCode: 0, signal: null, timedOut: false, summary: "ok" };
  }, "medio");
  expect(r.nivelUsado).toBe("medio");
  expect(r.escalou).toBe(false);
  expect(chamadas).toBe(1);
});

test("escala de baixo para medio quando falha", async () => {
  let chamadas = 0;
  const r = await executarComEscalonamento(async (nivel) => {
    chamadas++;
    if (nivel === "baixo")
      return { exitCode: 1, signal: null, timedOut: false, errorMessage: "falha" };
    return { exitCode: 0, signal: null, timedOut: false, summary: "ok" };
  }, "baixo");
  expect(r.nivelUsado).toBe("medio");
  expect(r.escalou).toBe(true);
  expect(chamadas).toBe(2);
});

test("escala ate o nivel maximo quando falha em todos", async () => {
  let chamadas = 0;
  const r = await executarComEscalonamento(async (nivel) => {
    chamadas++;
    return { exitCode: 1, signal: null, timedOut: false, errorMessage: "falha " + nivel };
  }, "baixo");
  expect(r.nivelUsado).toBe("alto");
  expect(r.escalou).toBe(true);
  expect(chamadas).toBe(3);
  expect(r.historico).toHaveLength(3);
});

test("timeout é tratado como falha e escala", async () => {
  let chamadas = 0;
  const r = await executarComEscalonamento(async (nivel) => {
    chamadas++;
    if (nivel === "baixo")
      return { exitCode: 0, signal: null, timedOut: true, summary: "timeout" };
    return { exitCode: 0, signal: null, timedOut: false, summary: "ok" };
  }, "baixo");
  expect(r.nivelUsado).toBe("medio");
  expect(r.escalou).toBe(true);
  expect(chamadas).toBe(2);
});

test("niveis estao em ordem correta", () => {
  expect(NIVEIS_ORDEM).toEqual(["baixo", "medio", "alto"]);
});

test("parametros de cada nivel estao definidos", () => {
  expect(NIVEL_PARAMETROS.baixo.maxTurns).toBe(5);
  expect(NIVEL_PARAMETROS.medio.maxTurns).toBe(15);
  expect(NIVEL_PARAMETROS.alto.maxTurns).toBe(50);
  expect(NIVEL_PARAMETROS.baixo.timeoutSec).toBe(300);
  expect(NIVEL_PARAMETROS.medio.timeoutSec).toBe(1800);
  expect(NIVEL_PARAMETROS.alto.timeoutSec).toBe(3600);
});
