#!/usr/bin/env npx tsx
/**
 * Pré-processamento determinístico antes de chamar a IA.
 *
 * Princípio: não gastar inteligência artificial para fazer o que um script
 * resolve sozinho. Este script consulta registros de agentes, filtra os que
 * apresentam falhas de inicialização, identifica versões divergentes, agrupa
 * erros semelhantes e entrega ao modelo apenas os casos relevantes.
 *
 * Uso:
 *   npx tsx scripts/preprocessar-agentes.ts --empresa <companyId>
 *
 * Saída: JSON com casos relevantes para investigação técnica (para enviar ao Claude)
 * e um resumo executivo para o Hermes.
 */

import fs from "node:fs/promises";
import path from "node:path";

interface Agente {
  id: string;
  name: string;
  status: string;
  adapterType: string;
  lastHeartbeat?: string | null;
  version?: string | null;
  errors?: string[];
}

interface CasoRelevante {
  id: string;
  name: string;
  problema: string;
  grupo: string;
  versao: string | null;
  detalhes: string[];
}

/**
 * Lê a lista de agentes. Substituir por chamada real à API Paperclip.
 */
async function listarAgentes(companyId: string): Promise<Agente[]> {
  // Em produção, isso faria: curl $PAPERCLIP_API_URL/companies/${companyId}/agents
  // Aqui simulamos a leitura de um arquivo de registro existente, se houver.
  const caminho = path.resolve(`data/agentes-${companyId}.json`);
  try {
    const conteudo = await fs.readFile(caminho, "utf-8");
    return JSON.parse(conteudo);
  } catch {
    // Sem dados locais: retorna vazio. Em produção, chamaria a API.
    return [];
  }
}

/**
 * Passo 2 — Filtrar agentes com falhas de inicialização.
 * Critérios: status diferente de "ready" ou heartbeat antigo (> 15 min).
 */
function filtrarComFalhas(agentes: Agente[]): Agente[] {
  const limite = Date.now() - 15 * 60 * 1000;
  return agentes.filter((a) => {
    if (a.status !== "ready") return true;
    if (a.lastHeartbeat && new Date(a.lastHeartbeat).getTime() < limite) return true;
    return false;
  });
}

/**
 * Passo 3 — Identificar versões diferentes.
 * Retorna agentes cuja versão diverge da maioria.
 */
function identificarVersoesDivergentes(agentes: Agente[]): Agente[] {
  const contagem: Record<string, number> = {};
  for (const a of agentes) {
    const v = a.version || "desconhecida";
    contagem[v] = (contagem[v] || 0) + 1;
  }
  const versaoMajoritaria = Object.entries(contagem).sort(([, a], [, b]) => b - a)[0]?.[0];
  return agentes.filter((a) => (a.version || "desconhecida") !== versaoMajoritaria);
}

/**
 * Passo 4 — Agrupar erros semelhantes.
 * Normaliza mensagens de erro para grupos.
 */
function agruparErros(agentes: Agente[]): Record<string, Agente[]> {
  const grupos: Record<string, Agente[]> = {};
  for (const a of agentes) {
    for (const erro of a.errors ?? []) {
      const grupo = normalizarErro(erro);
      if (!grupos[grupo]) grupos[grupo] = [];
      grupos[grupo].push(a);
    }
  }
  return grupos;
}

function normalizarErro(erro: string): string {
  const e = erro.toLowerCase();
  if (e.includes("python3") || e.includes("python")) return "adaptador_windows_python";
  if (e.includes("timeout") || e.includes("connection")) return "timeout_conexao";
  if (e.includes("auth") || e.includes("token") || e.includes("api_key")) return "falha_autenticacao";
  if (e.includes("session") || e.includes("resume")) return "falha_sessao";
  if (e.includes("worktree") || e.includes("git")) return "falha_worktree";
  return "outro";
}

/**
 * Passo 5 — Eliminar redundância.
 * Fica com um caso representativo por grupo de erro.
 */
function deduplicar(grupos: Record<string, Agente[]>): CasoRelevante[] {
  const casos: CasoRelevante[] = [];
  for (const [grupo, membros] of Object.entries(grupos)) {
    const representante = membros[0];
    casos.push({
      id: representante.id,
      name: representante.name,
      problema: grupo,
      grupo,
      versao: representante.version ?? null,
      detalhes: representantesDetalhes(membros),
    });
  }
  return casos;
}

function representantesDetalhes(membros: Agente[]): string[] {
  const detalhes: string[] = [];
  for (const m of membros.slice(0, 3)) {
    detalhes.push(`${m.name} (status=${m.status}, versao=${m.version ?? "?"})`);
  }
  if (membros.length > 3) detalhes.push(`+ ${membros.length - 3} agente(s) com mesmo padrão`);
  return detalhes;
}

/**
 * Passo 6 — Montar saída para o Claude (apenas casos relevantes).
 */
function montarSaude(agentes: Agente[], casos: CasoRelevante[]) {
  const comFalha = filtrarComFalhas(agentes);
  const versoesDivergentes = identificarVersoesDivergentes(comFalha);

  return {
    total_agentes: agentes.length,
    agentes_com_falha: comFalha.length,
    versoes_divergentes: versoesDivergentes.length,
    casos_para_investigacao: casos.length,
    casos: casos,
    resumo_para_hermes:
      casos.length === 0
        ? "Nenhum agente com falha de inicialização detectado."
        : `Encontrados ${casos.length} grupo(s) de erro em ${comFalha.length} agente(s) com falha. Entregar ao Claude apenas os casos listados acima.`,
  };
}

/**
 * Entrada principal.
 */
async function main() {
  const args = process.argv.slice(2);
  const empresaIdx = args.indexOf("--empresa");
  const companyId = empresaIdx >= 0 ? args[empresaIdx + 1] : "default";

  if (!companyId) {
    console.error("Uso: npx tsx scripts/preprocessar-agentes.ts --empresa <companyId>");
    process.exit(1);
  }

  const agentes = await listarAgentes(companyId);
  const comFalha = filtrarComFalhas(agentes);
  const grupos = agruparErros(comFalha);
  const casos = deduplicar(grupos);
  const saida = montarSaude(agentes, casos);

  console.log(JSON.stringify(saida, null, 2));
}

main().catch((err) => {
  console.error("Erro no pré-processamento:", err);
  process.exit(1);
});
