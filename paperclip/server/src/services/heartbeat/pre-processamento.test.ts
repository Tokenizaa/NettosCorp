import { expect, test } from "vitest";
import {
  preprocessarAntesDaIA,
  filtrarComFalhas,
  agruparErros,
  deduplicar,
  identificarVersoesDivergentes,
} from "./pre-processamento.js";

const AGENTES: any[] = [
  {
    id: "a1",
    name: "Agente Alfa",
    status: "ready",
    adapterType: "hermes_local",
    lastHeartbeat: new Date().toISOString(),
    version: "1.0.0",
    errors: [],
  },
  {
    id: "a2",
    name: "Agente Beta",
    status: "error",
    adapterType: "hermes_local",
    lastHeartbeat: new Date().toISOString(),
    version: "1.0.0",
    errors: ["python3 not found: adaptador Windows"],
  },
  {
    id: "a3",
    name: "Agente Gama",
    status: "error",
    adapterType: "hermes_local",
    lastHeartbeat: new Date().toISOString(),
    version: "1.1.0",
    errors: ["python3 not found: adaptador Windows"],
  },
  {
    id: "a4",
    name: "Agente Delta",
    status: "ready",
    adapterType: "claude_local",
    lastHeartbeat: new Date().toISOString(),
    version: "1.0.0",
    errors: [],
  },
  {
    id: "a5",
    name: "Agente Épsilon",
    status: "error",
    adapterType: "hermes_local",
    lastHeartbeat: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    version: "1.0.0",
    errors: ["timeout de conexão com o modelo"],
  },
  {
    id: "a6",
    name: "Agente Zeta",
    status: "error",
    adapterType: "hermes_local",
    lastHeartbeat: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    version: "1.2.0",
    errors: ["timeout de conexão com o modelo"],
  },
  {
    id: "a7",
    name: "Agente Eta",
    status: "error",
    adapterType: "hermes_local",
    lastHeartbeat: new Date().toISOString(),
    version: "1.0.0",
    errors: ["falha de autenticação: api_key ausente"],
  },
];

test("filtra agentes com falhas", () => {
  const comFalha = filtrarComFalhas(AGENTES);
  expect(comFalha.length).toBe(5); // a2, a3, a5, a6, a7
  expect(comFalha.some((a) => a.id === "a1")).toBe(false);
  expect(comFalha.some((a) => a.id === "a4")).toBe(false);
});

test("identifica versões divergentes", () => {
  const comFalha = filtrarComFalhas(AGENTES);
  const div = identificarVersoesDivergentes(comFalha);
  // Versão majoritária entre comFalha é 1.0.0 (a2, a5, a7). Divergentes: a3 (1.1.0), a6 (1.2.0)
  expect(div.length).toBe(2);
  expect(div.some((a) => a.id === "a3")).toBe(true);
  expect(div.some((a) => a.id === "a6")).toBe(true);
});

test("agrupa erros semelhantes", () => {
  const comFalha = filtrarComFalhas(AGENTES);
  const grupos = agruparErros(comFalha);
  expect(grupos["adaptador_windows_python"]).toHaveLength(2); // a2, a3
  expect(grupos["timeout_conexao"]).toHaveLength(2); // a5, a6
  expect(grupos["falha_autenticacao"]).toHaveLength(1); // a7
});

test("deduplica mantendo um representante por grupo", () => {
  const comFalha = filtrarComFalhas(AGENTES);
  const grupos = agruparErros(comFalha);
  const casos = deduplicar(grupos);
  expect(casos.length).toBe(3);
  // O grupo adaptador_windows_python tem a2 como representante
  expect(casos.find((c) => c.grupo === "adaptador_windows_python")?.id).toBe("a2");
});

test("preprocessarAntesDaIA reduz 7 agentes para 3 casos", () => {
  const resultado = preprocessarAntesDaIA(AGENTES);
  expect(resultado.total_agentes).toBe(7);
  expect(resultado.agentes_com_falha).toBe(5);
  expect(resultado.casos_para_investigacao).toBe(3);
  expect(resultado.resumo_para_hermes).toContain("3 grupo(s) de erro");
  expect(resultado.resumo_para_hermes).toContain("5 agente(s) com falha");
});

test("sem falhas retorna zero casos", () => {
  const apenasOk = AGENTES.filter((a) => a.status === "ready");
  const resultado = preprocessarAntesDaIA(apenasOk);
  expect(resultado.casos_para_investigacao).toBe(0);
  expect(resultado.resumo_para_hermes).toContain("Nenhum agente com falha");
});
